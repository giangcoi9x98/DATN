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
				const conn = await this.mysql.beginTransaction();
				try {
					let { user } = ctx.meta;
					const data = await this.mysql.queryMulti(
						`select email, a.id, status, ai.fullname, ai.address, ai.avatar, ai.accountId,
						ai.background, ai.birthday, ai.company, ai.gender,ai.phone
						from account as a INNER JOIN account_info as ai
						ON a.id = ai.accountId WHERE ai.accountId != ?`,
						[user.id],
						conn
					);

					//await this.mysql.query("SET autocommit = 0");

					const result = await Promise.all(
						data.map(async (e) => {
							const message = await this.mysql
								.queryMulti(
									`SELECT email, a.id as accountId,m.id as messageId, groupId,
									senderId, receiverId, m.is_delete  from account as a
									 INNER JOIN fmessage  as m ON a.id = m.senderId
									 WHERE a.id = ? AND receiverId = ? OR a.id = ? AND receiverId = ?`,
									[user.id, e.id, e.id, user.id],
									conn
								)
								.then((res) => res);
							await Promise.all(
								message.map(async (e) => {
									console.log("dasdasdsadas", e);
									const detailMessage = await this.mysql
										.query(
											"SELECT * FROM message_detail  WHERE messageId = ?",
											[e.messageId],
											conn
										)
										.then((res) => res[0]);
									e.detail = detailMessage;
									return {
										e,
									};
								})
							);
							e.messages = message;
							return {
								contact: e,
							};
						})
					);
					await this.mysql.commitTransaction(conn);
					return new ResponseData(true, "SUCCESS", result);
				} catch (error) {
					this.logger.error("Error at GetAllUser action ", error);
					await this.mysql.rollbackTransaction(conn);
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
