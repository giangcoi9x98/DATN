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
			params: {
				limit: "number|optional",
			},
			async handler(ctx) {
				try {
					await this.mysql.query("START TRANSACTION;");
					const data = await this.mysql
						.queryMulti("SELECT * FROM post")
						.then((res) => res);
					await this.mysql.query("SET autocommit = 0");
					const result = await Promise.all(
						data.map(async (element) => {
							const comment = await this.mysql
								.queryMulti(
									"SELECT * FROM comment WHERE postId =?",
									[element.id]
								)
								.then((res) => res);
							const like = await this.mysql
								.queryMulti(
									"SELECT * FROM like_post WHERE postId = ?",
									[element.id]
								)
								.then((res) => res);
							const file = await this.mysql.queryMulti(
								"SELECT * FROM file WHERE postId = ?",
								[element.id]
							);
							element.totalLike = like.length;
							element.likes = like;
							element.totalComment = comment.length;
							element.comments = comment;
							element.files = file;
							return {
								post: element,
							};
						})
					);
					// console.log("el", res);
					console.log("data", result[0]);
					await this.mysql.query("COMMIT;");
					return new ResponseData(true, "SUCCESS", result);
				} catch (error) {
					this.logger.error("Error at getAllPost action ", error);
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
					const { content, img } = ctx.params;
					await this.mysql.query("START TRANSACTION");
					const res = await this.mysql.query(
						"INSERT INTO post(accountId, content) VALUES(?, ?)",
						[user.id, content]
					);

					if (img) {
						console.log("insert with img");
						const file = await this.mysql.query(
							`
						INSERT INTO file(accountId, filename, path, postId)
						VALUES(?, ?, ?, ?)`,
							[
								user.id,
								"img",
								`${user.email +"/"+ img}`,
								res.insertId,
							]
						);
						await this.mysql.query(
							"UPDATE post SET fileId = ? WHERE id = ?",
							[file.insertId, res.insertId]
						);
					}
					const data = await this.mysql.query(
						"SELECT * FROM post WHERE id = ?",
						[res.insertId]
					);
					await this.mysql.query("COMMIT");
					return new ResponseData(true, "Success", data);
				} catch (error) {
					this.logger.error("Error at newPost action ", error);
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
