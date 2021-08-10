"use strict";
const CommonMixin = require("../mixins/common.mixin");
const ResponseData = require("../lib/response");
const { MoleculerError } = require("moleculer").Errors;
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
		follow: {
			params: {
				followId: {
					type: "number",
					require: true,
				},
			},
			async handler(ctx) {
				try {
					const { followId } = ctx.params;
					const { user } = ctx.meta;
					console.log("followId", followId);
					const isFollow = await this.mysql.query(
						"SELECT COUNT(id) as isFollow FROM follow WHERE accountId = ? and followId = ?",
						[user.id, followId]
					);
					if (isFollow[0].isFollow < 1) {
						const res = await this.mysql.query(
							"INSERT INTO follow(accountId, followId) VALUES (?, ?)",
							[user.id, followId]
						);
						return new ResponseData(true, "SUCCESS", "Followed");
					}
					return new ResponseData(
						true,
						"SUCCESS",
						"This person is followed by you"
					);
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
		changePassword: {
			params: {
				currentPassword: {
					type: "string",
					min: 6,
					max: 20,
					require: true,
				},
				newPassword: {
					type: "string",
					min: 6,
					max: 20,
					require: true,
				},
				repeatPassword: {
					type: "string",
					min: 6,
					max: 20,
					require: true,
				},
			},
			async handler(ctx) {
				try {
					const { currentPassword, newPassword, repeatPassword } =
						ctx.params;
					const user = await this.mysql.queryOne(
						"SELECT * FROM account where id = ? ",
						[ctx.meta.user.id]
					);
					const passwordMatch = bcrypt.compareSync(
						currentPassword.trim(),
						user.password
					);
					if (passwordMatch) {
						if (newPassword !== repeatPassword) {
							throw new MoleculerError("Password not match", 400);
						}
						const salt = bcrypt.genSaltSync(saltRounds);
						const hash = bcrypt.hashSync(repeatPassword, salt);
						const res = await this.mysql.query(
							`
						UPDATE account
						SET password = ?
						WHERE id = ?
						`,
							[hash, user.id]
						);
						return new ResponseData(true, "SUCCESS", res);
					} else {
						return new ResponseData(
							false,
							"INVALID PASSWORD",
							[],
							null,
							400
						);
					}
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
		updateProfile: {
			params: {
				fullname: {
					type: "string",
					require: true,
				},
				company: "string|optinal",
				phone: "string|optinal",
				birthday: "string|optinal",
				gender: "string|optinal",
			},
			async handler(ctx) {
				try {
					const { fullname, company, phone, birthday, gender } =
						ctx.params;
					const res = await this.mysql.query(
						`
					UPDATE account_info
					SET
					fullname = ?,
					company	= ?,
					phone = ?,
					birthday = ?,
					gender = ?
					WHERE accountId = ? 
					`,
						[
							fullname,
							company,
							phone,
							birthday,
							gender,
							ctx.meta.user.id,
						]
					);
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
		updateAvatar: {
			params: {
				avatar: {
					type: "string",
					require: true,
				},
			},
			async handler(ctx) {
				try {
					const { avatar } = ctx.params;
					const res = await this.mysql.query(
						"UPDATE account_info SET avatar = ? WHERE accountId = ?",
						[avatar, ctx.meta.user.id]
					);
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
		updateBackground: {
			params: {
				background: {
					type: "string",
					require: true,
				},
			},
			async handler(ctx) {
				try {
					const { background } = ctx.params;
					const res = await this.mysql.query(
						`
					UPDATE account_info
					SET
					background = ?
					WHERE accountId = ?
					`,
						[background, ctx.meta.user.id]
					);
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
				try {
					let { email } = ctx.params;
					const follows = await this.mysql.queryMulti(
						`SELECT accountId FROM follow
						INNER JOIN account ON account.id= follow.followId
						 WHERE account.email = ?`,
						[email]
					);
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
					res[0].follows = follows;
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
			params: {
				email: {
					type: "email",
					require: true,
				},
			},
			async handler(ctx) {
				const conn = await this.mysql.beginTransaction();
				try {
					let { user } = ctx.meta;
					const data = await this.mysql.queryMulti(
						`select email, a.id, status, ai.fullname, ai.address, ai.avatar, ai.accountId,
						ai.background, ai.birthday, ai.company, ai.gender,ai.phone
						from account as a INNER JOIN account_info as ai
						ON a.id = ai.accountId WHERE a.email != ?`,
						[ctx.params.email],
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
		getAllConatct: {
			async handler(ctx) {
				const conn = await this.mysql.beginTransaction();
				try {
					let { user } = ctx.meta;
					const followers = await this.mysql.queryMulti(
						"select followId from follow WHERE accountId = ? ",
						[user.id]
					);
					const listFollow = followers
						.map((elem) => {
							return elem.followId;
						})
						.join(",");
					const data = await this.mysql.queryMulti(
						`(select email, a.id, status, ai.fullname, ai.address, ai.avatar, ai.accountId,
							ai.background, ai.birthday, ai.company, ai.gender,ai.phone
							from account as a INNER JOIN account_info as ai
							ON a.id = ai.accountId WHERE ai.accountId  in (${listFollow})
							and ai.accountId != ?
						)
						UNION
							(select email, a.id, status, ai.fullname, ai.address, ai.avatar, ai.accountId,
							ai.background, ai.birthday, ai.company, ai.gender,ai.phone
							from account as a INNER JOIN account_info as ai
							ON a.id = ai.accountId WHERE ai.accountId  not in (${listFollow})
							and ai.accountId != ?
						)`,
						[user.id, user.id],
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
