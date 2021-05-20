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

					const id = uuid();
					console.log(id, uuid());
					const msg = await this.mysql.query(
						"INSERT INTO message(id, senderId, receiverId) VALUES(?, ?, ?) ;",
						[id, user.id, roomId]
					);
					const msgDeatil = await this.mysql.query(
						"INSERT INTO message_detail(content, type, messageId) VALUES(?, ?, ?)",
						[message, type, id]
					);
					await Promise.all([msg, msgDeatil]);
					this.broker.call("api-gateway.broadcast", {
						event: "NEW_MESSAGE",
						args: [
							{
								message,
								roomId,
							},
						],
						roomId: roomId,
					});
					return new ResponseData(true, "Success");
				} catch (error) {
					this.logger.error("ERROR at sendMessage", error);

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
