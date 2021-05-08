"use strict";
const CommonMixin = require("../mixins/common.mixin");
const ResponseData = require("../lib/response");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "post",
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
		getAllPost: {
			async handler(ctx) {
				try {
					const data =  await this.mysql.queryMulti("SELECT * FROM post").then(res => res);
					console.log(data);
					return new ResponseData(true, "SUCCESS", data);
				} catch (error) {
					this.logger.error("Error at getAllPost action ", error);
					throw error;
				}
			},
			hooks: {
				async before(ctx) {
					this.originalSchema.hooks.before.isAuthenticate(ctx);
				},
			},
		},
		newPost: {
			params: {
				content: {
					type: "string",
					require: true,
				},
				img: "string|optional",
			},
			async handler(ctx) {
				try {
					const { user } = ctx.meta;
				} catch (error) {
					this.logger.error("Error at GetbyEmail action ", error);
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
