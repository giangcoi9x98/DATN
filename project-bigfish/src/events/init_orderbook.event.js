const { MoleculerError } = require('moleculer').Errors;
module.exports = function(ctx){
    this.logger.info(`INIT ORDERBOOK event received`, ctx)
    const {userId} = ctx.meta;
    //fetch recent trades and opening order by order ID
    this.logger.info(`params`, ctx.params)
    const {room} = ctx.params; //exp: order_book_1_2
    //getting bond id and currency_id
    const [bond_id, currency_id] = room.replace('order_book_').split('_')
    const result = Promise.all(
        [
            this.knex('bond_trading_transaction').select('*').where({
                bond_id,
                currency_id
            }).orderBy('created_at', 'desc').limit(20),
            userId ? this.knex('bond_trading_orders').select('*').where({
                bond_id,
                currency_id,
                user_id: userId || 0
            }).orderBy('created_at', 'desc').limit(10) : Promise.resolve([])
        ]
    )
    this.broker.call('api-gateway.broadcast', {
        event: 'INIT_ORDERBOOK',
        args: result,
        rooms: [room]
    })
}
