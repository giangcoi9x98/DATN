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
					let { email } = ctx.params;
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
		getAll: {
			async handler(ctx) {
				try {
					await this.mysql.query("START TRANSACTION;");
					let { user } = ctx.meta;
					const data = await this.mysql
						.queryMulti(
							`select email, a.id, status, ai.fullname, ai.address, ai.avatar, ai.accountId,
						ai.background, ai.birthday, ai.company, ai.gender,ai.phone
						from account as a INNER JOIN account_info as ai
						ON a.id = ai.accountId WHERE ai.accountId != ?`,
							[user.id]
						)
						.then((res) => res);
					await this.mysql.query("SET autocommit = 0");
					const result = await Promise.all(
						data.map(async (e) => {
							const message = await this.mysql
								.queryMulti(
									`SELECT email, a.id as accountId,m.id as messageId, messageInfoId, groupId,
									senderId, receiverId, m.is_delete  from account as a
									 INNER JOIN message  as m ON a.id = m.senderId
									 WHERE a.id = ? AND receiverId = ?`,
									[user.id, e.id]
								)
								.then((res) => res);
							if (message.length) {
								await Promise.all(
									message.map(async (e) => {
										console.log(e);
										const detailMessage = await this.mysql
											.query(
												"SELECT * FROM message_detail  WHERE messageId = ?",
												[e.messageInfoId]
											)
											.then((res) => res[0]);
										e.detail = detailMessage;
									})
								);
							}
							e.messages = message;
							return {
								contact: e,
							};
						})
					);
					await this.mysql.query("COMMIT;");
					return new ResponseData(true, "SUCCESS", result);
				} catch (error) {
					this.logger.error("Error at GetAllUser action ", error);
					await this.mysql.query("ROLLBACK");
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
