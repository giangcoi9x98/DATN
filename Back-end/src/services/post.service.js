"use strict";
const CommonMixin = require("../mixins/common.mixin");
const ResponseData = require("../lib/response");
const { MoleculerError } = require("moleculer").Errors;
const uuid = require("uuid").v4;

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
				const conn = await this.mysql.beginTransaction();

				try {
					const data = await this.mysql.queryMulti(
						"SELECT * FROM post ORDER BY update_at DESC",
						[],
						conn
					);
					const result = await Promise.all(
						data.map(async (element) => {
							const comment = await this.mysql.queryMulti(
								"SELECT * FROM comment WHERE postId =?",
								[element.id],
								conn
							);
							const like = await this.mysql.queryMulti(
								"SELECT * FROM like_post WHERE postId = ?",
								[element.id],
								conn
							);
							const file = await this.mysql.queryMulti(
								"SELECT * FROM file WHERE postId = ?",
								[element.id],
								conn
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
					await this.mysql.commitTransaction(conn);
					return new ResponseData(true, "SUCCESS", result);
				} catch (error) {
					this.logger.error("Error at getAllPost action ", error);
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
		newPost: {
			params: {
				content: {
					type: "string",
					require: true,
				},
				img: "array|optional",
			},
			async handler(ctx) {
				const conn = await this.mysql.beginTransaction();
				try {
					const { user } = ctx.meta;
					const { content, img } = ctx.params;
					let id = uuid();
					// this.socketBroadcast({
					// 	event: "NEW_MESSAGE",
					// 	args: [
					// 		{
					// 			name: "giang",
					// 		},
					// 	],
					// });
					const res = await conn.query(
						"INSERT INTO post(id, accountId, content) VALUES(?, ?, ?)",
						[id, user.id, content]
					);

					if (img.length) {
						console.log("img", img);
						await Promise.all(
							img.map(async (e) => {
								let fileId = uuid();
								await conn.query(
									`
								INSERT INTO file(id, accountId, filename, path, postId)
								VALUES(?,?, ?, ?, ?)`,
									[
										fileId,
										user.id,
										"img",
										`${user.email + "/" + e}`,
										id,
									]
								);
							})
						);
					}
					const data = await conn.query(
						"SELECT * FROM post WHERE id = ?",
						[id]
					);
					await this.mysql.commitTransaction(conn);
					return new ResponseData(true, "Success", data.data);
				} catch (error) {
					this.logger.error("Error at newPost action ", error);
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

		getPostById: {
			params: {
				id: "string",
			},
			async handler(ctx) {
				const conn = await this.mysql.beginTransaction();
				try {
					const { id } = ctx.params;
					const data = await this.mysql.queryOne(
						"SELECT * FROM post WHERE id = ?",
						[id],
						conn
					);

					const comment = await this.mysql.queryMulti(
						"SELECT * FROM comment WHERE postId =?",
						[data.id],
						conn
					);

					const like = await this.mysql.queryMulti(
						"SELECT * FROM like_post WHERE postId = ?",
						[data.id],
						conn
					);

					const file = await this.mysql.queryMulti(
						"SELECT * FROM file WHERE postId = ?",
						[data.id],
						conn
					);
					data.totalLike = like.length;
					data.likes = like;
					data.totalComment = comment.length;
					data.comments = comment;
					data.files = file;
					
					await this.mysql.commitTransaction(conn);	
					return new ResponseData(true, "SUCCESS", data);
				} catch (error) {
					await this.mysql.rollbackTransaction(conn);
					console.log("error", error);
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
