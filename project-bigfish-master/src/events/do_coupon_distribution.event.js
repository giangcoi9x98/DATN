const { MoleculerError } = require('moleculer').Errors;
const {calculateNextCouponPaymentTimestamp, FeeServiceName, BondHistoryType} = require('../lib/common')
module.exports = async function({bond, coupon_payment_history_id, is_able_to_mature}){
    try{
        await this.postgres.query(`BEGIN`)
        await this.postgre.query('LOCK TABLE bonds IN ROW EXCLUSIVE MODE');
        const query =  `SELECT *, (amount - service_fees) as distribute_amount FROM coupon_payment_history WHERE id = ${coupon_payment_history_id} FOR UPDATE;`
        const couponPaymentHistoryData = await this.postgres.query(
           query
        )
        if (couponPaymentHistoryData.rowCount <= 0) {
          throw new MoleculerError(
              "No coupon history record found by id: " + coupon_payment_history_id,
              500,
              ""
          )
        }
        const paymentData = couponPaymentHistoryData.rows[0]
        if (!paymentData.is_funded) {
            throw new MoleculerError(
                "No fund found in order to process: " + coupon_payment_history_id + ', is funded: ' + paymentData.is_funded,
                500,
                ""
            )
        }
        if (paymentData.is_distributed) {
          throw new MoleculerError(
              `Coupon Payment ID ${coupon_payment_history_id} distributed.`,
              500,
              ""
          )
        }
        if (paymentData.amount > paymentData.funded_amount) {
            throw new MoleculerError(
                `Not enough money to paid. Required ${paymentData.amount}, Available ${paymentData.funded_amount}`,
                500,
                ""
            )
        }
        await this.insertFeeChargingHistoryByPostgres({
            user_id: bond.issuer_id,
            currency_id: bond.face_currency_id,
            service: FeeServiceName.INTEREST_PAYMENT,
            amount: paymentData.service_fees,
            data: {
                coupon_payment_history_id: paymentData.id
            }
        })
        let mature_receive_fee_amount = 0;
        if (is_able_to_mature) {
            const mature_receive_fee = await this.broker.call('config.getServiceFeeByName', {
                name: 'mature_receive_fee'
            }).then(Number)
            mature_receive_fee_amount = (mature_receive_fee/100)*Number(paymentData.distribute_amount);
        }

        const bondHolders = await this.postgres.query(
            `SELECT (balance+freeze_balance) / ${bond.total_supply} as percentage, * FROM bond_wallets WHERE bond_id = ${bond.id} AND balance > 0;`
        )
        let total_distributed = 0;
        if (bondHolders.rowCount > 0) {
            for (const holder of bondHolders.rows) {
                let amountForHolder = (holder.percentage || 0)*Number(paymentData.distribute_amount);
                const lateFeesForHolder = Number(couponPaymentHistoryData.late_fees)*(holder.percentage || 0)
                const serviceFeeForHolderAmount = is_able_to_mature ? (holder.percentage || 0)*mature_receive_fee_amount : 0
                amountForHolder -= serviceFeeForHolderAmount
                // if (amountForHolder > paymentData.funded_amount) {
                //   throw
                // }
                await this.postgres.query(
                    `UPDATE crypto_wallets SET balance = balance + $1 WHERE user_id = $2 AND currency_id = $3 RETURNING id`,
                    [
                        amountForHolder,
                        holder.user_id,
                        bond.face_currency_id
                    ]
                ).then(async (res) => {
                    if (res.rowCount > 0) {
                      await this.knex('bond_wallets').where({
                          bond_id: bond.id,
                          user_id: holder.user_id
                      }).increment('total_interest_received', is_able_to_mature ? amountForHolder - (Number(bond.face_value)*Number(bond.total_supply)) : amountForHolder)

                      // this.broker.emit('new_fee_charged', {
                      //     user_id: holder.user_id,
                      //     currency_id: bond.face_currency_id,
                      //     service: FeeServiceName.MATURE_RECEIVE_FEE,
                      //     amount: serviceFeeForHolderAmount,
                      //     fee_charging_history_id: feeChargingId}, ['event-handler'])
                      return Promise.all([
                          this.insertCryptoWalletLogs(res.rows[0].id, amountForHolder, {
                              type: 'coupon_receive',
                              bond_id: bond.id,
                              coupon_payment_history_id,
                              round: paymentData.payment_cycle_id || 0,
                              fees: serviceFeeForHolderAmount,
                              late_fees: lateFeesForHolder
                          }).then(result => is_able_to_mature ? this.insertFeeChargingHistoryByPostgres({
                              user_id: holder.user_id,
                              currency_id: bond.face_currency_id,
                              service: FeeServiceName.MATURE_RECEIVE_FEE,
                              amount: serviceFeeForHolderAmount,
                              data: {
                                  coupon_payment_history_id: paymentData.id,
                                  crypto_wallet_logs_id: result.rowCount > 0 ? result.rows[0].id : 0,
                                  round: paymentData.payment_cycle_id || 0,
                              }
                          }) : Promise.resolve() ).then(() => {
                              total_distributed += amountForHolder;
                          }),
                          this.insertBondHistoryByPostgresql({
                              bond_id: bond.id,
                              type: BondHistoryType.CouponReceive,
                              from: 0,
                              to:  holder.user_id,
                              amount: amountForHolder,
                              data: {
                                  fees: serviceFeeForHolderAmount,
                                  round: paymentData.payment_cycle_id || 0,
                                  coupon_payment_history_id
                              }
                          })
                      ])
                    }
                });


            }

        } else{
            this.logger.info(`No bond holders found. Bond Id`, bond.id)
        }
        const queryUpdatePh = `UPDATE coupon_payment_history
                SET
                    is_distributed = true,
                    distributed_timestamp = ${this.moment.utc().valueOf()},
                    total_distributed_amount = total_distributed_amount + ${total_distributed},
                    funded_amount = funded_amount - ${total_distributed}
                WHERE id = ${coupon_payment_history_id} AND funded_amount >= ${total_distributed} RETURNING id`;
        this.logger.info(`queryUpdatePh`, queryUpdatePh)
        const canUpdate = await this.postgres.query(
            queryUpdatePh
        )
        this.logger.info(`canUpdate`, canUpdate, total_distributed)

        this.emitEventHandler('clearPaymentFulfillmentCache', {
            bond_id: bond.id
        })
        if (canUpdate.rowCount <= 0) {
          throw new MoleculerError(
              "Cannot update coupon_payment_history because do not enough fund to transfer to bond holders",
              500,
              ""
          )
        }

        await this.postgres.query(
            `UPDATE bonds
                SET
                    next_coupon_payment_timestamp = ${calculateNextCouponPaymentTimestamp(bond)},
                    last_payment_cycle_id = ${paymentData.payment_cycle_id_plus > 0 ? paymentData.payment_cycle_id_plus : paymentData.payment_cycle_id}
                WHERE id = ${bond.id}`
        )
        await this.postgres.query(`COMMIT`)
    }catch (error) {
        await this.postgres.query(`ROLLBACK`)
        this.logger.error('do coupon distribution error: Bond ID', bond.id, 'Error: ', error);
        // await this.postgre.query('ROLLBACK');
        throw new MoleculerError(
            error.message,
            error.code || 500,
            error.type || "",
            error.data || {}
        );
    }
}
