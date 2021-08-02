// require("dotenv").config();
const moment = require("moment");
const Decimal = require("decimal.js");
const { checkIsAuthenticated, SocketEvent } = require("../lib/common");
const Langs = require("../lang/error.code");
const { MoleculerError } = require("moleculer").Errors;
const redisConnect = require("../lib/redis-connect");
const { RABBITMQ_URI } = process.env || "amqp://localhost";
const amqp = require("amqplib/callback_api");
const mysql = require("../lib/mysql");
const mssql = require("../lib/mssql");
let index = 0;

function randomString(
	length,
	chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
) {
	let result = "";
	for (let i = length; i > 0; --i)
		result += chars[Math.floor(Math.random() * chars.length)];
	return result;
}
// var rString = randomString(32);
module.exports = {
	// redis: null,
	methods: {
		checkIsAuthenticated,
		insertCryptoWalletLogs(
			wallet_id,
			balance,
			reasonObj,
			freezeBalanceChange = 0
		) {
			this.broker.emit(
				"socketBroadcastCryptoBalanceChange",
				{ wallet_id, amount: balance },
				["event-handler"]
			);
			return this.postgres.query(
				"INSERT INTO crypto_wallet_logs (wallet_id, amount, reason, created_timestamp, freeze_amount) VALUES($1, $2, $3, $4, $5) RETURNING id",
				[
					wallet_id,
					balance,
					JSON.stringify(reasonObj),
					moment.utc().valueOf(),
					freezeBalanceChange,
				]
			);
		},
		insertCryptoWalletLogsByTransactingKnex({
			T,
			wallet_id,
			balance,
			reasonObj,
			freezeBalanceChange = 0,
			amount = 0,
		}) {
			this.broker.emit(
				"socketBroadcastCryptoBalanceChange",
				{ wallet_id, amount: balance || amount },
				["event-handler"]
			);
			return this.knex("crypto_wallet_logs")
				.transacting(T)
				.insert({
					wallet_id: wallet_id,
					amount: balance || amount,
					freeze_amount: freezeBalanceChange,
					reason: JSON.stringify(reasonObj),
					created_timestamp: moment.utc().valueOf(),
				});
		},
		insertFeeChargingHistoryByPostgres({
			user_id,
			currency_id,
			service,
			amount,
			amount_distribute_to_referral = 0,
			data = {},
			could_emit_new_fee_charged = true,
		}) {
			return this.postgres
				.query(
					`INSERT INTO fee_charging_history
(user_id, currency_id, service, amount, created_timestamp, amount_distribute_to_referral, data)
VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
					[
						user_id,
						currency_id,
						service,
						amount,
						this.utcTimestamp(),
						amount_distribute_to_referral,
						JSON.stringify(data),
					]
				)
				.then((result) => {
					if (could_emit_new_fee_charged) {
						this.broker.emit(
							"new_fee_charged",
							{
								user_id,
								currency_id,
								service,
								amount,
								fee_charging_history_id: result.rows[0].id,
							},
							["event-handler"]
						);
					}
					return result.rows[0].id;
				});
		},
		insertFeeChargingByKnexTransaction({
			trx,
			user_id,
			currency_id,
			service,
			amount,
			amount_distribute_to_referral = 0,
			data = {},
			could_emit_new_fee_charged = true,
		}) {
			return this.knex("fee_charging_history")
				.transacting(trx)
				.insert({
					user_id,
					currency_id,
					service,
					amount,
					created_timestamp: this.utcTimestamp(),
					amount_distribute_to_referral,
					data: JSON.stringify(data),
				})
				.returning("id")
				.then(([id]) => {
					if (could_emit_new_fee_charged) {
						this.broker.emit(
							"new_fee_charged",
							{
								user_id,
								currency_id,
								service,
								amount,
								fee_charging_history_id: id,
							},
							["event-handler"]
						);
					}
					return id;
				});
		},
		insertBondHistoryByKnexTransaction({
			trx,
			bond_id,
			type,
			from,
			to,
			amount,
			data = {},
		}) {
			return this.knex("bond_history")
				.transacting(trx)
				.insert({
					bond_id,
					type,
					from,
					to,
					amount,
					data: JSON.stringify(data),
					timestamp: this.utcTimestamp(),
				})
				.returning("id");
		},
		insertBondHistoryByPostgresql({
			bond_id,
			type,
			from,
			to,
			amount,
			data = {},
		}) {
			return this.postgres
				.query(
					`INSERT INTO bond_history ("bond_id", "type", "from", "to", amount, "timestamp", "data")
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
					[
						bond_id,
						type,
						from,
						to,
						amount,
						this.utcTimestamp(),
						JSON.stringify(data),
					]
				)
				.then((d) => d.rows["id"]);
		},
		utcTimestamp() {
			return moment.utc().valueOf();
		},
		actionCommonError(fnName, e) {
			this.logger.error(`Action name -${fnName}- error`, e);
			throw new MoleculerError("ERROR", 500, Langs.INTERNAL_SERVER_ERROR);
		},
		actionThrowError(fnName, error) {
			this.logger.error(`Action name ${fnName} ERROR`, error);
			throw new MoleculerError(
				error.message,
				error.code || 500,
				error.type || Langs.INTERNAL_SERVER_ERROR,
				error.data || []
			);
		},
		throwUserError() {
			throw new MoleculerError(
				"No user found",
				401,
				Langs.AUTHENTICATION_ERROR
			);
		},
		throwMoleculerError(message, code, type, data) {
			throw new MoleculerError(
				message,
				code || 500,
				type || Langs.INTERNAL_SERVER_ERROR,
				data
			);
		},
		socketBroadcastUser(userId, { event, args }) {
			return this.broker.call("api-gateway.broadcast", {
				event,
				args,
				rooms: ["me/" + userId],
			});
		},
		emitEventHandler(name, data) {
			return this.broker.emit(name, data, ["event-handler"]);
		},
		socketBroadcast({ event, rooms, args }) {
			return this.broker.call("api-gateway.broadcast", {
				event,
				args,
				rooms,
			});
		},
		generateRedisMailTokenKey(key, data, liveInMinutes = 15) {
			return this.redis.get(key).then((token) => {
				if (token) {
					return token;
				} else {
					token = randomString(
						64,
						"0123456789abcdefghijklmnopqrstuvwxyz"
					);
					return Promise.all([
						this.redis.set(key, token),
						this.redis.set(token, JSON.stringify(data)),
					]).then((result) =>
						Promise.all([
							this.redis.expire(key, liveInMinutes * 60),
							this.redis.expire(token, liveInMinutes * 60),
						]).then((res) => token)
					);
				}
			});
		},
		async transactionWallet(user_id, profit, currency) {
			try {
				await this.postgres.query("BEGIN");
				await this.postgres.query(
					`UPDATE crypto_wallets set balance = balance +${profit} where currency=$1 and user_id = $2`,
					[currency, user_id]
				);
				const wallet_id = await this.postgres
					.query(
						"SELECT id FROM crypto_wallets where user_id = $1 and currency = $2",
						[user_id, currency]
					)
					.then((res) => res.rows[0].id);
				await this.postgres.query(
					"INSERT INTO crypto_wallet_logs(wallet_id,amount,currency) VALUES($1,$2,$3)",
					[wallet_id, profit, currency]
				);
				await this.postgres.query("COMMIT");
			} catch (err) {
				console.log(err);
				await this.postgres.query("ROLL BACK");
				throw err;
			}
		},
		randomString(length = 15) {
			let result = "";
			const characters =
				"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			const charactersLength = characters.length;
			for (let i = 0; i < length; i++) {
				result += characters.charAt(
					Math.floor(Math.random() * charactersLength)
				);
			}
			return result;
		},
		async createCryptoWalletLog(msg) {
			let exchange = "topic_logs";
			let args = ["first_queue", "second_queue", "third_queue"];
			let key = args.length > 0 ? args[index % 3] : "anonymous.info"; //--repl
			this.channel.assertExchange(exchange, "topic", {
				durable: false,
			});
			this.channel.publish(
				exchange,
				key,
				Buffer.from(JSON.stringify(msg))
			);
			index++;
		},
	},
	async started() {
		this.redis = await redisConnect.getInstance();
		this.mysql = await mysql;
		// await amqp.connect(RABBITMQ_URI, (error, connection) => {
		// 	if (error) {
		// 		console.log(error);
		// 		throw error;
		// 	}
		// 	connection.createChannel((error, channel) => {
		// 		if (error) {
		// 			console.log(error);
		// 		}
		// 		this.channel = channel;
		// 	});
		// });

		// this.postgres.query(`select enum_range(null::payment_period);`).then(res => console.log(res.rows))
		this.moment = moment;
		this.Decimal = Decimal;
	},
};
