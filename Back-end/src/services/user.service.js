"use strict";
const CommonMixin = require("../mixins/common.mixin");
const ResponseData = require("../lib/response");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "user",
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
		getProfile: {
			async handler(ctx) {
				try {
					console.log("profileUser", ctx.meta.user);
					const res = await this.mysql.query(
						`
					SELECT *
					FROM account_info
					INNER JOIN account
					ON account.id = account_info.accountId
					WHERE accountId = ?
					`,
						[ctx.meta.user.id]
					);
					console.log("user", res, ctx.meta.user.id);
					return new ResponseData(true, "SUCCESS", res);
				} catch (error) {
					this.logger.error("Error at getProfile action ", error);
					throw error;
				}
			},
			hooks: {
				async before(ctx) {
					this.originalSchema.hooks.before.isAuthenticate(ctx);
				},
			},
		},
		getByEmail: {
			params: {
				email: {
					type: "email",
					require: true,
				},
			},
			async handler(ctx) {
				console.log("emailgetbyemail", ctx.params);
				try {
					let {email} = ctx.params;
					const res = await this.mysql.query(
						`
					SELECT *
					FROM account_info
					INNER JOIN account
					ON account.id = account_info.accountId
					WHERE email = ?
					`,
						[ctx.params.email]
					);
					return new ResponseData(true, "SUCCESS", res);
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
