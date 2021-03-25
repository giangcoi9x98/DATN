const { MoleculerError } = require('moleculer').Errors;
const LANGs = require('../lang/error.code');
const {BondHistoryType} = require('../lib/common')

//Calculate interest
const {DayByPeriod, PaymentPeriodShorthand, SecondByPeriod, BondStatus, PaymentPeriod} = require('../lib/common')
const {calculateCouponAmount, isAbleToMature, totalPaymentPeriod} = require('../lib/helper')


module.exports = async function (bonds) {
    // this.logger.info(`Process coupon payment event received`)
    // console.log(bonds)
    const interest_fee = (await this.broker.call('config.getServiceFeeByName', {
        name: 'interest_fee'
    }).then(Number)) || 0
    return Promise.all(bonds.map(async bond => {
        let [amountNeedToPay, serviceFeeAmount, amountNoFee] = calculateCouponAmount(bond, false, interest_fee)
        console.log(`Bond ID ${bond.id}, amount need to pay ${amountNeedToPay}`)
        const day = this.moment.utc(bond.next_coupon_payment_timestamp, 'x').format('DD-MM-YYYY');
        const current_payment_cycle_id = bond.last_payment_cycle_id + 1;
        await this.postgre.query('BEGIN');
        await this.postgre.query('LOCK TABLE bonds IN ROW EXCLUSIVE MODE');
        let coupon_payment_data = await this.postgres.query(
            `SELECT * FROM coupon_payment_history WHERE bond_id = ${bond.id} AND payment_cycle_id >= ${current_payment_cycle_id} FOR UPDATE;`
        )
        if (coupon_payment_data.rowCount <= 0) {
            //if not exist any record on coupon_payment_history
            //process current payment cycle by an initial data
            //then make sure for do the loop
            coupon_payment_data.rows = [
                {
                    is_funded: false,
                    is_fake: true,
                    re_try: 0,
                    next_retry_timestamp: 0
                }
            ]
        }
        for(const couponPaymentData of coupon_payment_data.rows){
            let next_retry_timestamp = 0,
                is_funded = false,
                funded_timestamp = 0,
                update_query = [],
                is_distributed = false,
                distributed_timestamp = 0;

            try{
                if (couponPaymentData.is_funded) {
                    is_funded = couponPaymentData.is_funded;
                    funded_timestamp = couponPaymentData.funded_timestamp;
                }else{
                    if (!couponPaymentData.is_fake) {
                        amountNeedToPay = couponPaymentData.amount;
                        serviceFeeAmount = couponPaymentData.service_fees || serviceFeeAmount
                    }
                    const checkWallet = await this.postgre.query(
                        `SELECT id,currency_id FROM crypto_wallets
                  WHERE user_id = ${bond.issuer_id} AND currency_id = ${bond.face_currency_id}
                  FOR UPDATE`,
                    );
                    if (checkWallet.rowCount <= 0) {
                        throw new MoleculerError(
                            "No Wallet Found",
                            500,
                            ""
                        )
                    }
                    const minus_balance = await this.postgres.query(
                        `UPDATE crypto_wallets SET balance = balance - $1 WHERE id = $2 AND balance >= $1 RETURNING id`,
                        [
                            amountNeedToPay,
                            checkWallet.rows[0].id
                        ]
                    )

                    if (minus_balance.rowCount > 0) {
                        is_funded = true;
                        funded_timestamp = this.moment.utc().valueOf();
                        await Promise.all([
                            this.insertCryptoWalletLogs(minus_balance.rows[0].id, -amountNeedToPay, {
                                type: 'coupon_payment',
                                bond_id: bond.id,
                                round: current_payment_cycle_id
                            }),
                            this.insertBondHistoryByPostgresql({
                                bond_id: bond.id,
                                type: BondHistoryType.AddFundToBillingCycle,
                                from: minus_balance.rows[0].id,
                                to: 0,
                                amount: amountNoFee,
                                data: {
                                    round: current_payment_cycle_id
                                }
                            })
                        ])
                    } else{
                        //issuer inssuffient balance to make the payment
                        let lateFee = 0, needAddLateFee = false;
                        //no enough fund, retry in 8 hours
                        let paymentPenalty;
                        try{
                            paymentPenalty = await this.broker.call('config.getByName', {name: 'paymentPenalty'})
                        }catch (e) {

                        }

                        const paymentPenaltyData = (paymentPenalty || {}).data || { times: 48, retry_hours: 8, fee: 1, fee_by_times: 4 };
                        // console.log(paymentPenalty)

                        if (bond.coupon_payment_period === PaymentPeriod.Day) {
                            const t24hTimes = Math.round(24/(paymentPenaltyData.retry_hours || 8))
                            // console.log(t24hTimes, (couponPaymentData.re_try+1) % t24hTimes === 0, couponPaymentData.re_try+1)
                            if ((couponPaymentData.re_try+1) % t24hTimes === 0) {
                                //insert next payment
                                update_query.push(`payment_cycle_id_plus = ${((couponPaymentData.re_try+1) / t24hTimes) + current_payment_cycle_id}`)
                                const [secondAmountNeedTopay, secondServiceFee] = calculateCouponAmount(bond, true, interest_fee)
                                update_query.push(`service_fees = coupon_payment_history.service_fees + ${secondServiceFee}`)
                                lateFee = this.Decimal.add(secondAmountNeedTopay, lateFee).toNumber()
                                needAddLateFee = true
                            }
                        }
                        next_retry_timestamp = this.moment.utc().add((paymentPenaltyData.retry_hours || 8) , 'h').valueOf()
                        this.logger.info(`Next retry timestamp ${next_retry_timestamp}, current ${couponPaymentData.next_retry_timestamp}, DIFF: ${ next_retry_timestamp - this.moment.utc().valueOf()} ${next_retry_timestamp-couponPaymentData.next_retry_timestamp}`)
                        if ((couponPaymentData.re_try+1) % (paymentPenaltyData.fee_by_times || 4) === 0) {
                            const paymentPenaltyFee = couponPaymentData.amount * ((paymentPenaltyData.fee || 1) / 100)
                            update_query.push(`late_fees = coupon_payment_history.late_fees + ${paymentPenaltyFee}`)
                            lateFee = this.Decimal.add(paymentPenaltyFee, lateFee).toNumber()
                            needAddLateFee = true;
                        }
                        if (needAddLateFee) {
                            update_query.push(`amount = coupon_payment_history.amount + ${lateFee}`)
                        }
                        update_query.push(`re_try = coupon_payment_history.re_try + 1`)
                        update_query.push(`next_retry_timestamp = ${next_retry_timestamp}`)
                        //emit an event to send mail or SMS in order to notice the issuer
                        const max_attempt = (paymentPenaltyData.times || 48)

                        Promise.all([
                            this.broker.call('user.getEmailById', {
                                user_id: bond.issuer_id
                            }),
                            this.knex('crypto_currencies').select('symbol').where({
                                id: checkWallet.rows[0].currency_id
                            }).first()
                        ]).then(
                            ([email, crypto]) => {
                                return this.broker.call('mail.sendMail', {
                                    to: email,
                                    template: 'FAILED_AUTOMATIC_COUPON_PAYMENT',
                                    data: {
                                        amount_required: amountNeedToPay.toFixed(8) + ' ' + crypto.symbol,
                                        max_attempt
                                    },
                                })
                            }
                        )

                        if (couponPaymentData.re_try+1>=max_attempt) {
                            // distribute collateral to bond holders
                            this.logger.info('Do do_distribute_collateral')
                            await this.broker.emit('do_distribute_collateral', {
                                bond,
                                paymentPenaltyData,
                                couponPaymentData
                            })
                        }
                    }

                }
                if (is_funded && !couponPaymentData.funded_amount) {
                  update_query.push(`funded_amount = ${amountNeedToPay}`)

                }
                const couponPaymentHistoryData =

                    /*await executeInsertOrUpdateCouponHistoryQuery(this.postgres, update_query, [
                    bond.id, day, amountNeedToPay, is_funded, is_distributed, 0, next_retry_timestamp, is_funded ? amountNeedToPay : 0, current_payment_cycle_id, funded_timestamp, distributed_timestamp
                ])*/
                await this.postgres.query(
                    `INSERT INTO coupon_payment_history (
                            bond_id,
                            day,
                            amount,
                            is_funded,
                            is_distributed,
                            re_try,
                            next_retry_timestamp,
                            funded_amount,
                            payment_cycle_id,
                            funded_timestamp,
                            distributed_timestamp,
                            service_fees
                        ) VALUES (
                            $1,
                            $2,
                            $3,
                            $4,
                            $5,
                            $6,
                            $7,
                            $8,
                            $9,
                            $10,
                            $11,
                            $12
                        )
                        ON CONFLICT (bond_id, payment_cycle_id)
                        DO
                        UPDATE SET
                            -- funded_amount = $8,
                            is_funded = $4,
                            funded_timestamp = $10
                            ${(update_query.length > 0 ? ', ' : '') + update_query.join(',')} RETURNING id`,
                    [bond.id, day, amountNeedToPay, is_funded, is_distributed, 0, next_retry_timestamp, is_funded ? amountNeedToPay : 0, current_payment_cycle_id, funded_timestamp, distributed_timestamp, serviceFeeAmount],
                )

                //\\ do distribution
                if (is_funded) {
                    const is_able_to_mature = isAbleToMature(bond)
                    await this.broker.emit('do_coupon_distribution', {
                        coupon_payment_history_id: couponPaymentHistoryData.rows[0].id,
                        bond: bond,
                        amountNeedToPay: amountNeedToPay,
                        is_able_to_mature
                    })
                    if (is_able_to_mature) {
                        await this.postgres.query(
                            `UPDATE bonds
                    SET status = '${BondStatus.Matured}'
                WHERE id = ${bond.id}`
                        )
                        await this.postgres.query(
                            `UPDATE crypto_wallets SET balance = balance + ${bond.collateral_value}, freeze_balance = freeze_balance - ${bond.collateral_value} WHERE user_id = $1 AND currency_id = $2 RETURNING id`,
                            [
                                bond.issuer_id,
                                bond.collateral_currency_id
                            ]
                        ).then(
                            result => {
                                return Promise.all([
                                    this.insertCryptoWalletLogs(result.rows[0].id, bond.collateral_value, {
                                        type: 'bond_matured',
                                        bond_id: bond.id
                                    }, -bond.collateral_value),
                                    this.insertBondHistoryByPostgresql({
                                        bond_id: bond.id,
                                        type: BondHistoryType.CollateralReturn,
                                        from: 0,
                                        to:  bond.issuer_id,
                                        amount: bond.collateral_value,
                                        data: {
                                            currency_id: bond.collateral_currency_id
                                        }
                                    })
                                ]);
                            }
                        )
                        await this.broker.emit('move_bond_wallet_to_zero', {bond})

                    }
                }
                //console.log([bond.id, day, amountNeedToPay, is_funded, is_distributed, 0, next_retry_timestamp, is_funded ? amountNeedToPay : 0, current_payment_cycle_id, funded_timestamp, distributed_timestamp])
                await this.postgre.query('COMMIT');

            }catch (error) {

                this.logger.info('an error occurs')
                this.logger.error('process_coupon_payment error: Bond ID', bond.id, 'Error: ', error);
                await this.postgre.query('ROLLBACK');
                throw new MoleculerError(
                    error.message,
                    error.code || 500,
                    error.type || LANGs.INTERNAL_SERVER_ERROR,
                    error.data || {}
                );
            }
        }

    }));
}
