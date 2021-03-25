const {SocketEvent} = require('../lib/common')
module.exports = async function({user_id, bond_id, amount}){
    // const user_id = await this.knex('crypto_wallets').where({
    //     id: wallet_id
    // }).select('user_id').first().then(r=>r.user_id)
    return this.socketBroadcastUser(user_id,{
        event: SocketEvent.BOND_BALANCE_CHANGED,
        args: [{amount, bond_id}]
    })
}
