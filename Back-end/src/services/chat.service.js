"use strict";
const CommonMixin = require("../mixins/common.mixin");
const ResponseData = require("../lib/response");
const { MoleculerError } = require("moleculer").Errors;

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
				this.broker.call("api-gateway.broadcast", {
					event: "NEW_MESSAGE",
					args: ["giang"],
				});
			},
			hooks: {
				async before(ctx) {
					this.originalSchema.hooks.before.isAuthenticate(ctx);
				},
			},
		},
	},
};
