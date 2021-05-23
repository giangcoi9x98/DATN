"use strict";
const CommonMixin = require("../mixins/common.mixin");
const ResponseData = require("../lib/response");
const { MoleculerError } = require("moleculer").Errors;
const uuid = require("uuid").v4;
module.exports = {
	name: "chat",
	mixins: [CommonMixin],
	hooks: {
		before: {
			isAuthenticate(ctx) {
				if (!ctx.meta.user) {
					throw new MoleculerError(
						"Unauthorized",
						401,
						undefined,
						[]
					);
				}
			},
		},
	},
	actions: {
		createRoom: {
			params: {
				roomName: "string",
			},
			async handler(ctx) {
				console.log("roomName", ctx);
			},
			hooks: {
				async before(ctx) {
					this.originalSchema.hooks.before.isAuthenticate(ctx);
				},
			},
		},
		sendMessage: {
			params: {
				roomId: "number",
				message: "string",
			},
			async handler(ctx) {
				try {
					const { message, roomId } = ctx.params;
					const { user } = ctx.meta;
					const type = "text"; // TODO: is file with images
					console.log("message", message);

					let id = uuid();
					const conn = await this.mysql.beginTransaction();
					await conn
						.query(
							"INSERT INTO fmessage(id, senderId, receiverId) VALUES(?, ?, ?) ;",
							[id, user.id, roomId]
						);
					await conn
						.query(
							"INSERT INTO message_detail(content, type, messageId) VALUES(?, ?, ?)",
							[message, type, id]
						);
					const isExistsSender = await this.mysql.queryOne(
						"SELECT COUNT(id) as count FROM chat_history WHERE  senderId = ? and receiverId = ? OR  senderId = ? and receiverId = ? ",
						[user.id, roomId, roomId, user.id],
						conn
					);
					const isExitsReceiver = await this.mysql.queryOne(
						"SELECT COUNT(id) as count FROM chat_history WHERE senderId = ? and receiverId = ? OR  senderId = ? and receiverId = ?",
						[roomId, user.id, user.id, roomId],
						conn
					);
					if (isExistsSender.count == "0") {
						await conn.query(
							"INSERT INTO chat_history(accountId, senderId, receiverId, messageId) VALUES(?, ?, ?, ?)",
							[user.id, user.id, roomId, id]
						);
					}
					if (isExitsReceiver.count == "0") {
						await conn.query(
							"INSERT INTO chat_history(accountId, senderId, receiverId, messageId) VALUES(?, ?, ?, ?)",
							[roomId,user.id, roomId, id]
						);
					}
					await conn.query(
						"UPDATE chat_history set senderId = ?, receiverId = ?, messageId = ? WHERE accountId = ?",
						[user.id, roomId, id, user.id]
					);
					await conn.query(
						"UPDATE chat_history set senderId = ?, receiverId = ?, messageId = ? WHERE accountId = ?",
						[user.id, roomId, id, roomId]
					);
					await this.mysql.commitTransaction(conn);
					this.broker.call("api-gateway.broadcast", {
						event: "NEW_MESSAGE",
						args: [
							{
								sender: user,
								message,
								roomId,
							},
						],
						roomId: roomId,
					});
					return new ResponseData(true, "Success");
				} catch (error) {
					this.logger.error("ERROR at sendMessage", error);
					await this.mysql.rollbackTransaction();
					throw error;
				}
			},
			hooks: {
				async before(ctx) {
					this.originalSchema.hooks.before.isAuthenticate(ctx);
				},
			},
		},
		getChatHistory: {
			async handler(ctx) {
				const { user } = ctx.meta;
				const conn = await this.mysql.beginTransaction();
				try {
					const chatHistory = await this.mysql.queryMulti(
						"SELECT * FROM chat_history WHERE accountId = ?",
						[user.id],
						conn
					);
					const res = await Promise.all(
						chatHistory.map(async e => {
							const contactId =  e.senderId == e.accountId ? e.receiverId : e.senderId;
							const contact = await this.mysql.queryOne(
								"SELECT * FROM account WHERE id = ?",
								[contactId],
								conn
							);
							e.contactData = contact;
							return e;
						})
					);
					return new ResponseData(true, "Success", res);
				} catch (error) {
					await this.mysql.rollbackTransaction();
					throw error;
				}
			},
			hooks: {
				async before(ctx) {
					this.originalSchema.hooks.before.isAuthenticate(ctx);
				},
			},
		},
	},
};
