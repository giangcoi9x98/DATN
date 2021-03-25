module.exports = async function ({pair_ids, room}) {
    const prices = await Promise.all(pair_ids.map(async pairId => {
        const [bond_id, currency_id] = pairId.split('|').map(Number)
        const {price} = await this.broker.call('bond-trading.getLastPrice', {
            bond_id,
            currency_id
        })
        return {
            bond_id,
            currency_id,
            last_price: Number(price)
        }
    }))
    return this.socketBroadcast({
        event: 'INIT_BOND_PRICE',
        rooms: [room],
        args: [prices]
    })
}
