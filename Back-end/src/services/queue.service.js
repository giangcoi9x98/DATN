"use strict";
require("dotenv").config();
const amqp = require("amqplib/callback_api");
const commonMixin = require("../mixins/common.mixin");

module.exports = {
	name: "queue",
	mixins: [commonMixin],
	async started() {
		let routingKey = ["first_queue", "second_queue", "third_queue"];
		if (routingKey.length == 0) {
			console.log("Usage: receive_logs_topic.js <facility>.<severity>");
			process.exit(1);
		}
		amqp.connect("amqp://rabbitmq:rabbitmq@rabbitmq:5672/", function (error, connection) {
			if (error) {
				console.log(error);
				throw error;
			}
			connection.createChannel(function (error, channel) {
				if (error) {
					console.log(error);
					throw error;
				} else {
					console.log("rabitmq is connected ");
				}
				let exchange = "topic_logs";
				channel.assertExchange(exchange, "topic", {
					durable: false,
				});
				routingKey.map((e) => {
					createQueue(channel, exchange, e);
				});
			});
		});
		const createQueue = async (channel, exchange, queue) => {
			channel.assertQueue(
				queue,
				{
					durable: true,
				},
				function (error2, q) {
					if (error2) {
						throw error2;
					}
					channel.bindQueue(q.queue, exchange, queue);
					channel.consume(
						q.queue,
						async (msg) => {
							console.log(
								" [x] %s:'%s'",
								msg.fields.routingKey,
								msg.content.toString()
							);
							if (msg.fields.routingKey == queue) {
								await transaction(msg);
								await channel.ack(msg);
							}
						},
						{
							noAck: false,
						}
					);
				}
			);
		};
		const transaction = async (msg) => {
			let { user_id, profit, currency } = JSON.parse(
				msg.content.toString()
			);
			const wallet_id = await this.postgres
				.query(
					"SELECT id FROM crypto_wallets where user_id = $1 and currency = $2",
					[user_id, currency]
				)
				.then((res) => res.rows[0].id);
			console.log("wallet_id", wallet_id);
			await this.postgres.query(
				`INSERT INTO crypto_wallet_logs(wallet_id,amount,currency)
             VALUES($1,$2,$3)`,
				[wallet_id, profit, currency]
			);
		};
	},
};
