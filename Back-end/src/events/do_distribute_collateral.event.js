const Decimal = require('decimal.js');
const {BondStatus, BondHistoryType} = require('../lib/common')
const { MoleculerError } = require('moleculer').Errors;
const LANGs = require('../lang/error.code');
module.exports = async function ({bond, paymentPenaltyData, couponPaymentData}) {
    this.logger.info('DO distribute collateral')
    //TODO confirm can distribute?
    //Check large than 48 coupon payment?
    if (couponPaymentData.re_try + 1 >= (paymentPenaltyData.times || 48)) {
        await this.postgres.query('BEGIN');
        try{
            const bondHolders = await this.postgres.query(
                `SELECT balance / ${bond.total_supply} as percentage, * FROM bond_wallets WHERE bond_id = ${bond.id} AND balance > 0;`
            )
            let total_distributed = 0;
            if (bondHolders.rowCount > 0) {
                for (const holder of bondHolders.rows) {
                    const amountForHolder = Number((new Decimal(bond.collateral_value)).mul((holder.percentage || 0)));
                    // if (amountForHolder > paymentData.funded_amount) {
                    //   throw
                    // }

                    await this.postgres.query(
                        `UPDATE crypto_wallets SET balance = balance + $1 WHERE user_id = $2 AND currency_id = $3 RETURNING id`,
                        [
                            amountForHolder,
                            holder.user_id,
                            bond.collateral_currency_id
                        ]
                    ).then(async (res) => {
                        console.log(res)
                        if (res.rowCount > 0) {
                            return Promise.all([
                                this.insertCryptoWalletLogs(res.rows[0].id, amountForHolder, {
                                    type: 'distribute_collateral',
                                    bond_id: bond.id
                                }),
                                this.insertBondHistoryByPostgresql({
                                    bond_id: bond.id,
                                    type: BondHistoryType.CollateralDistributed,
                                    from: 0,
                                    to:  holder.user_id,
                                    amount: amountForHolder,
                                    data: {
                                        fees: 0,
                                        currency_id: bond.collateral_currency_id
                                    }
                                })
                            ])
                        }
                    });

                    total_distributed = Decimal.add(amountForHolder, total_distributed).toNumber();
                }

            } else{
                this.logger.info(`No bond holders found. Bond Id`, bond.id)
            }
            if (total_distributed > 0) {
                await this.postgres.query(
                    `UPDATE crypto_wallets SET freeze_balance = freeze_balance - $1 WHERE user_id = $2 AND currency_id = $3 RETURNING id`,
                    [
                        total_distributed,
                        bond.issuer_id,
                        bond.collateral_currency_id
                    ]
                ).then(
                    result => this.insertCryptoWalletLogs(result.rows[0].id, 0, {
                        type: 'distribute_collateral',
                        bond_id: bond.id,
                        is_issuer: true
                    }, -total_distributed)
                )
            }
            await this.postgres.query(
                `UPDATE bonds
                    SET status = '${BondStatus.Matured}'
                WHERE id = ${bond.id}`
            )
            await this.postgres.query(
                `UPDATE coupon_payment_history
                    SET is_distributed = true,
                    distributed_timestamp = ${this.moment.utc().valueOf()},
                    payment_type = 'DistributeCollateral',
                    total_distributed_amount = ${total_distributed}
                WHERE id = ${couponPaymentData.id}`
            )
            await this.broker.emit('move_bond_wallet_to_zero', {bond})
            await this.postgres.query('COMMIT')
        }catch (error) {
            this.logger.error('do_distribute_collateral error: Bond ID', bond.id, 'Error: ', error);
            await this.postgre.query('ROLLBACK');
            throw new MoleculerError(
                error.message,
                error.code || 500,
                error.type,
                error.data || {}
            );
        }

    }
}
