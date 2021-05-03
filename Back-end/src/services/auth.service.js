const { MoleculerError } = require("moleculer").Errors;
const bcrypt = require("bcrypt");
const md5 = require("md5");
const authenticator = require("authenticator");
const CommonMixin = require("../mixins/common.mixin");
const _ = require("lodash");
const regex = require("../lib/regex");
const tokenHelper = require("../lib/token");
const ResponseData = require("../lib/response");
const LANGs = require("../lang/error.code");
const saltRounds = 10;
const forgotPWPrefix = "FORGOT_PW_KEY_";
const refreshTokenPrefix = "RF_TOKEN_";
const accessTokenPrefix = "ACCESS_TOKEN_";
const bannedTokenPrefix = "BANNED_TOKEN_";
const newDeviceTokenPrefix = "NEW_DEVICE_TOKEN_";
const accessTokenExp = "15m"; //15m
const refreshTokenExp = "1h";
const uuidv1 = require("uuid").v1();
const uuidv4 = require("uuid").v4();
const forgotPWSendMailPrefix = "CAN_SEND_MAIL_FOR_FG_PW_";
const twoFactorAuthenticationPrefix = "VERIFY_2FA_";
const VERIFY_EMAIL_PREFIX = "VERIFY_EMAIL:";

function safeUser(user) {
	return _.omit(user, [
		"password_salt",
		"password_hash",
		"two_factor_secret",
	]);
}
const {
	AUTH_PRIVATE_KEY = "LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlDWFFJQkFBS0JnUURXZDM0dlZnVE81dS85QUxpSkpGMXpQOUw2bFZtR1NXRWVjdGVnbFRxWVgyMkpMd2pJCmtOZDJLMEtWNTNNZWhjcnl0eVRHUW11ZjJkZDMwOXRjaEFIanRmZXpON05MM3JHMHpOUXg3QTN3SVYvSGg0ZVMKSDg5YXVLYkl4U3FpaXYwUnZrZlgyZnc3RkNDMGVvS2xVYTEzU0NvemUyVzUybGlGbFNTNURUcE9Xd0lEQVFBQgpBb0dCQUpTVVJpUlBLSmVhb0dxY0JEeG1xQ00rOVZCTEJiR2x4cFhNcEJ3SkpvWUhucUFxcUtBaTBGSjZsKys0CllDV21OVHEvck1kNW5vd281RUNNMG0wZXV4c2NUYnFNYTdSa2RXaTB3VHMzR1ozL2tMYzV3RDdYSmV2UnRlMDMKMS9oZ0o4bTNwWXBvaTMzWndCeDFDQmJvQWhZYjZXQ0NhUG9hbm45ZVVZWlBJQW5oQWtFQStnWHVqSzRxM3FMZgo3eU5kRElGb0ZPNE5ZVEtOQTZ1dEVscTc2Wk9BZ2JwQWkyRHFrcVBPQXhrZkhQMHBqSXBnZmVWaC9RMGpXL0RJCnliVlJrVm84S3dKQkFOdVg5MlBqNkpaUkRiTTNrb2toVnVGN05reUVyd0Q0STRvSjg2VG9mUFJlclYxSXp4L0QKc3l4R1NYQWFQR1pNb0Z4K0FDUWo2VDFPZTdIZkRWc3JycEVDUUUwVjh4eXd2a3J5VUxTOFpIM3NrQmlUNU5Bbwo4ODFENnhLVG93ZzdFQTN2VE9Nc09HYUoxb1NpQkRPOTRrZVFpbnVHYzVXL3JUMDFtZEtHOHVVcnV3MENRUUMxCmVSRHBiQjk2bWVGSWlsUi9IeDQ5bVNWMmR2QnBUS2VTSEVkTnNSUVNuMnVGKy9XdnVuc0h5ODVFNW1tajRROWwKWUh1ZFlsQU9haDJ2RVRab2NlRUJBa0J2aHRVSUcxclQ4cnI3T0xCQytPZmUrNC93WDRUOFNvWnEzNVFwdEt1ZAp5bTJaT2ZJRit1UEQwOVBqV0R2VW1iR1ZJQUdaeTZuWCs1RVVXSFJPRHNpMAotLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQo=",
	HS256_KEY = "p8pmwDX87MqPT0Mz3ovhoVpes5BN1SWiZ1MIXHYkNlM",
} = process.env;
/** @type {import('moleculer').ServiceSchema} */
const schema = {
	name: "auth",
	mixins: [CommonMixin],
	actions: {
		test: {
			handler() {
				return "hello";
			},
		},
		register: {
			params: {
				email: {
					type: "email",
					require: true,
					max: 32,
				},
				password: {
					type: "string",
					min: 6,
					max: 20,
					require: true,
				},

				fullname: {
					type: "string",
					require: true,
				},
				birthday: {
					type: "string",
					require : true,
				}

			},
			async handler(ctx) {
				let {
					email,
					password,
					fullname,
					birthday
				} = ctx.params;
				let repeatPassword = password;
				console.log(ctx.params);
				if (password == "") {
					throw new MoleculerError(
						"The 'password' field must not be empty.",
						400
					);
				}
				if (password !== repeatPassword)
					throw new MoleculerError(
						"Password mismatch",
						422,
						LANGs.PASSWORD_MISMATCH,
						[]
					);
				console.log(saltRounds, repeatPassword);
				const salt = bcrypt.genSaltSync(saltRounds);
				const hash = bcrypt.hashSync(repeatPassword, salt);
				const key = HS256_KEY || "secret";
				let a = regex.validtaeEmail(email);
				if (a !== true) {
					throw new MoleculerError(a, 422, "EMAIL_VALIDATE_FAIL", []);
				}
				const isExists = await this.mysql.queryOne(
					"SELECT COUNT(id) as isExists FROM account WHERE email = ?",
					[email]
				);

				if (isExists.isExists !== 0) {
					throw new MoleculerError(
						"Email Already Exist",
						400,
						LANGs.EMAIL_ALREADY_EXIST,
						[]
					);
				}
				try {
					await this.mysql.query(
						"INSERT INTO account (email,password) VALUES (?,?)  ",
						[
							regex.getEmail(email.toLowerCase()),
							hash,
						]
					);
					const newUserData = await this.mysql.queryOne(
						"SELECT * FROM account WHERE email = ?",[email]
					);
					console.log("user", newUserData);
					await this.mysql.query(
						`INSERT INTO account_info (fullname,birthday,accountId)
						VALUES (?, ?, ? )`,
						[
							fullname,
							birthday,
							newUserData.id
						]
					);
					// const ref_user = await this.mysql.query(`SELECT * from users where ref_id = $1`,[ref_id])
					// console.log("ref_user",checkRef_id);
					// await this.mysql.query(`INSERT INTO users_ref(user_id,ref_users_id,level,cretaed_timestamp,updated_timestamp)`
					// ,[ref_user.rows[0].id,newUserData.id,1,Date.now(),Date.now()])
					// await this.sendMailVerifyEmailAddress(newUserData)

					const { parsedUserAgent: userAgent, clientIp } = ctx.meta;
					const deviceName = this.buildDeviceName(userAgent);
					await this.mysql.query(
						`INSERT INTO login_history (ip, user_agent, browser_name, device_name, account_id)
              VALUES (?, ?, ?, ?, ?) `,
						[
							clientIp,
							userAgent.ua,
							userAgent.browser.name,
							deviceName,
							newUserData.id,
						]
					);
					const loginRecord = await this.mysql.query(
						"SELECT id FROM login_history WHERE account_id = ?",
						[newUserData.id]
					).then(res => res[0]);

					const secretKey = Buffer.from(
						AUTH_PRIVATE_KEY,
						"base64"
					).toString("utf-8");
					const infoData = await this.mysql.query(`
						SELECT * FROM
					 	account INNER JOIN account_info
						ON account.id = account_info.accountId
						WHERE account.id = ? `, [newUserData.id]).then(res => res[0]);
					const user = safeUser(infoData);

					const token = tokenHelper.signJWT(
						{
							...user,
							userData: user,
							loginId: loginRecord.id,
						},
						accessTokenExp,
						"RS256",
						secretKey,
						"user.login",
						user.email
					);

					const refreshToken = tokenHelper.signJWT(
						{
							id: user.accountId,
							loginId: loginRecord.id,
						},
						refreshTokenExp,
						"HS256",
						key,
						"user.login",
						user.email
					);
					await this.redis.setex(
						`${accessTokenPrefix}${loginRecord.id}`,
						60 * 60,
						token
					);
					await this.redis.setex(
						`${refreshTokenPrefix}${loginRecord.id}`,
						60 * 60,
						refreshToken
					);
					return new ResponseData(
						true,
						"SUCCESS",
						{
							token,
							refreshToken,
							user,
						},
						null
					);
					
				} catch (e) {
					this.logger.error("Register Error", e);
					// Error code for unique constraint
					if (e.code === "23505") {
						if (e.constraint === "users_ref_id") {
							return ctx.call("auth.register", ctx.params);
						}
						throw new MoleculerError(
							"Email Already Exist",
							500,
							LANGs.EMAIL_ALREADY_EXIST,
							[]
						);
					}
					throw new MoleculerError(
						e.message,
						500,
						LANGs.INTERNAL_SERVER_ERROR,
						e.stack
					);
				}
			},
		},
		async checkResetPasswordTokenExist(ctx) {
			const { token } = ctx.params || {};
			if (!token) {
				return {
					success: false,
				};
			}
			const key = HS256_KEY || "secret";
			const decodedToken = await tokenHelper.verify(token, key);
			if (decodedToken) {
				const redisToken = await this.redis.get(
					`${forgotPWPrefix}${decodedToken.id}`
				);
				if (redisToken === null) {
					return {
						success: false,
					};
				}
				if (token !== redisToken) {
					return {
						success: false,
					};
				}
				return {
					success: true,
				};
			}
			return {
				success: false,
			};
		},
		resetPassword: {
			params: {
				token: {
					type: "string",
					require: true,
				},
				new_password: {
					type: "string",
					require: true,
					min: 6,
					max: 20,
				},
				repeat_password: {
					type: "string",
					require: true,
					min: 6,
					max: 20,
				},
			},
			async handler(ctx) {
				this.logger.info(ctx.params);
				const {
					token,
					new_password: newPassword,
					repeat_password: repeatPassword,
				} = ctx.params;
				const key = HS256_KEY || "secret";
				if (newPassword !== repeatPassword)
					throw new MoleculerError(
						"Password mismatch",
						422,
						LANGs.PASSWORD_MISMATCH,
						[]
					);
				const decodedToken = await tokenHelper.verify(token, key);
				if (decodedToken) {
					this.logger.info("decodedToken", decodedToken);
					const redisToken = await this.redis.get(
						`${forgotPWPrefix}${decodedToken.id}`
					);
					this.logger.info("redisToken", redisToken);
					if (redisToken === null) {
						throw new MoleculerError(
							"Token Expired",
							500,
							LANGs.TOKEN_EXPIRED,
							[]
						);
					}
					if (token !== redisToken) {
						throw new MoleculerError(
							"Token Invalid",
							500,
							LANGs.TOKEN_INVALID,
							[]
						);
					}
					const salt = bcrypt.genSaltSync(saltRounds);
					const hash = bcrypt.hashSync(repeatPassword, salt);
					const updateInfo = await this.postgre.query(
						`
            UPDATE users
            SET password_salt = $2 ,password_hash = $3
            WHERE email = $1`,
						[decodedToken.email, salt, hash]
					);
					this.logger.info(updateInfo);

					// invalidate all token issue before now
					await this.redis.setex(
						`${bannedTokenPrefix}${decodedToken.id}`,
						15 * 60,
						Date.now()
					);

					// DESTROY REDIS TOKEN
					await this.redis.del(`${forgotPWPrefix}${decodedToken.id}`);

					return new ResponseData(true, "SUCCESS", null);
				}
				throw new MoleculerError(
					"Invalid Token",
					500,
					LANGs.TOKEN_INVALID,
					[]
				);
			},
		},
		forgotPassword: {
			params: {
				email: {
					type: "email",
					require: true,
				},
			},
			async handler(ctx) {
				const { email } = ctx.params;
				const getUser = await this.postgre.query(
					"SELECT id,email FROM users WHERE email = $1",
					[email.toLowerCase()]
				);
				if (getUser && getUser.rowCount === 1) {
					const userId = getUser.rows[0].id;
					this.logger.info(getUser.rows[0]);
					const token = await this.redis.get(
						`${forgotPWPrefix}${userId}`
					);
					const key = HS256_KEY || "secret";
					if (token) {
						this.logger.info(
							"got exist token for forgot password: ",
							token
						);
						// use token return from this.redis
						const sendMailBlock = await this.redis.get(
							`${forgotPWSendMailPrefix}${userId}`
						);
						if (sendMailBlock) {
							this.logger.info(
								`User try to send too many email in one minute!: ${userId}, sendMailBlock: ${sendMailBlock}`
							);
							throw new MoleculerError(
								"Please try again after 1 minute!",
								500,
								LANGs.REACH_SEND_MAIL_QUOTA,
								[]
							);
						}
						const userData = tokenHelper.verify(token, key);
						this.logger.info("user info: ", userData);
						await this.redis.setex(
							`${forgotPWSendMailPrefix}${userId}`,
							60,
							1
						);
						await ctx.call("mail.sendMail", {
							to: email,
							template: "RESET_PASSWORD",
							data: {
								token,
							},
						});
					} else {
						// gen new key
						const newToken = await tokenHelper.signJWT(
							{
								id: getUser.rows[0].id,
								email: getUser.rows[0].email,
							},
							"15m",
							"HS256",
							key
						);
						this.logger.info(
							"generate new token for forgot password: ",
							newToken
						);
						await this.redis.setex(
							`${forgotPWPrefix}${getUser.rows[0].id}`,
							900,
							newToken
						);
						// TODO sendMail data
						await ctx.call("mail.sendMail", {
							to: email,
							template: "RESET_PASSWORD",
							data: {
								token: newToken,
							},
						});
					}
				} //throw new MoleculerError('Email does not exist', 500, LANGs.EMAIL_NOT_FOUND, []);
				return new ResponseData(true, "SUCCESS", null);
			},
		},
		verifyEmail: {
			params: {
				t: {
					type: "string",
					require: true,
				},
			},
			async handler(ctx) {
				const { t } = ctx.params;
				try {
					const redisKey = VERIFY_EMAIL_PREFIX + t;
					this.logger.info("redisKey", redisKey);
					const userData = await this.redis
						.get(redisKey)
						.then((jsonData) => jsonData || "{}")
						.then(JSON.parse)
						.then((data) => data || {});
					this.logger.info("userData", userData);
					if (!userData.id) {
						throw new MoleculerError(
							"Token Invalid",
							500,
							LANGs.TOKEN_INVALID,
							[]
						);
					}
					const updateInfo = await this.postgre.query(
						`
          UPDATE users
          SET email_verified = $2
          WHERE id = $1`,
						[userData.id, "true"]
					);
					this.logger.info(
						"update user email_verified field :",
						updateInfo
					);

					this.socketBroadcast({
						event: "USER_VERIFY_SUCCESS",
						rooms: ["user_verify_success/" + userData.id],
						args: [],
					});

					// DESTROY REDIS TOKEN
					await Promise.all([
						this.redis.del(redisKey),
						this.redis.del(t),
					]);

					return new ResponseData(true, "SUCCESS", null);
				} catch (e) {
					this.actionThrowError("verifyEmail", e);
				}
			},
		},
		resendVerifyEmail: {
			authenticate: true,
			// params: { email: { type: 'email', require: true } },
			async handler(ctx) {
				const { email, id } = ctx.meta.user;
				this.logger.info("email", email);
				const key = HS256_KEY || "secret";
				const getUser = await this.postgre.query(
					"SELECT id,email,email_verified FROM users WHERE email = $1",
					[email.toLowerCase()]
				);
				if (getUser && getUser.rowCount === 0) {
					throw new MoleculerError(
						"Email does not exist",
						500,
						LANGs.EMAIL_NOT_FOUND,
						[]
					);
				}
				if (getUser.rows[0].email_verified) {
					throw new MoleculerError(
						"Email has been verified",
						500,
						LANGs.EMAIL_ALREADY_VERIFIED,
						[]
					);
				}
				await this.sendMailVerifyEmailAddress(ctx.meta.user);

				return new ResponseData(true, "SUCCESS", null);
			},
		},
		login: {
			params: {
				email: {
					type: "email",
					required: true,
				},
				password: {
					type: "string",
				},
			},
			async handler(ctx) {
				const { parsedUserAgent: userAgent, clientIp } = ctx.meta;
				this.logger.info(
					"user agent parsed : ",
					ctx.meta.parsedUserAgent
				);
				console.log("params", ctx.params);
				const secretKey = Buffer.from(
					AUTH_PRIVATE_KEY,
					"base64"
				).toString("utf-8");
				const key = HS256_KEY || "secret";
				const findUserByEmail = await this.mysql.queryOne(
					"SELECT * FROM account where email = ? ",
					[ctx.params.email.toLowerCase().trim()]
				);
				if (!findUserByEmail) {
					throw new MoleculerError(
						"The 'email' field is not exist",
						400
					);
				}
				if (!ctx.params.password) {
					throw new MoleculerError(
						"The 'password' field must not be empty",
						400
					);
				}
				if (findUserByEmail) {
					let user = findUserByEmail;
					this.logger.info("user info: ", user);
					const passwordMatch = bcrypt.compareSync(
						ctx.params.password.trim(),
						user.password
					);
					console.log("passwordMatch", passwordMatch);
					if (passwordMatch) {
						const findLoginHistory = await this.mysql.queryOne(
							"SELECT count(id) as count FROM login_history WHERE account_id = ? AND user_agent = ?",
							[user.accountId, userAgent.ua]
						);

						// Unbypass in production

						// if (
						// 	/*findLoginHistory && findLoginHistory.rows[0].count >*/ 1 ==
						// 	1
						// ) {
						// eslint-disable-next-line no-constant-condition
						if (1 == 1) {
							this.logger.info(
								"find login history: ",
								findLoginHistory
							);
							// create new login history record
							const loginRecord = await this.mysql.query(
								`INSERT INTO login_history (ip, user_agent, browser_name, device_name, account_id)
                VALUES (?, ?, ?, ?, ?) `,
								[
									clientIp,
									userAgent.ua,
									userAgent.browser.name,
									this.buildDeviceName(userAgent),
									user.accountId,
								]
							);
							this.logger.info(
								"insert login record: ",
								loginRecord
							);
							// eslint-disable-next-line no-constant-condition
							if (1 == 2) {
								// return token to login via 2FA next step
								const token = tokenHelper.signJWT(
									{
										id: user.id,
									},
									"15m",
									"HS256",
									key,
									"user.login",
									user.email
								);

								// return 15m token to verify 2FA login code
								return new ResponseData(
									true,
									"SUCCESS",
									{
										token,
										isTwoFactorToken: true,
										expiresAt: Date.now() + 15 * 60 * 1000,
									},
									LANGs.TWO_FACTOR_LOGIN_TOKEN
								);
							}

							// login success
							user = safeUser(user);
							this.logger.info("SIGN USER", user);
							const token = tokenHelper.signJWT(
								{
									...user,
									userData: user,
									loginId: loginRecord.id,
								},
								accessTokenExp,
								"RS256",
								secretKey,
								"user.login",
								user.email
							);

							const refreshToken = tokenHelper.signJWT(
								{
									id: user.id,
									loginId: loginRecord.id,
								},
								refreshTokenExp,
								"HS256",
								key,
								"user.login",
								user.email
							);

							await this.redis.setex(
								`${accessTokenPrefix}${loginRecord.id}`,
								60 * 60,
								token
							);
							await this.redis.setex(
								`${refreshTokenPrefix}${loginRecord.id}`,
								60 * 60,
								refreshToken
							);
							// delete user.password_salt;
							// delete user.password_hash;
							// delete user.two_factor_secret;
							// delete user.email_verified;
							// delete user.enable_2fa;
							const data = {
								user,
								token,
								refresh_token: refreshToken,
							};

							return new ResponseData(
								true,
								"LOGIN_SUCCESS",
								data
							);
						}
						// send email to request new device login
						const deviceName = this.buildDeviceName(userAgent);
						const redisKey = `${newDeviceTokenPrefix}_${user.id}_${deviceName}`;
						const lastSendKey = `lastsend:${redisKey}`;
						//checking ttl
						const ttlLastsendLeft = await this.redis.ttl(
							lastSendKey
						);
						if (ttlLastsendLeft <= 0) {
							//DO SEND
							const mailToken = await this.redis
								.get(redisKey)
								.then(async (d) => {
									if (d !== null && d.length > 0) {
										return d;
									} else {
										const token =
											md5(this.randomString(32)) +
											"u" +
											user.id;
										await this.redis.setex(
											redisKey,
											60 * 15,
											token
										);
										await this.redis.setex(
											token,
											60 * 15,
											JSON.stringify({
												user_id: user.id,
												userAgent: userAgent.ua,
												browser: userAgent.browser.name,
												deviceName,
												clientIp,
												mailToken: token,
											})
										);
										return token;
									}
								});
							await this.redis.setex(lastSendKey, 60 * 2, "1");
							// await ctx.call('mail.sendMail', {
							//   to: user.email,
							//   template: 'NEW_DEVICE_CONFIRMATION',
							//   data: {
							//     token: mailToken,
							//     deviceName,
							//     userAgent: userAgent.ua,
							//     browser: userAgent.browser.name,
							//     clientIp
							//   },
							// });
						}

						// const deviceToken = await tokenHelper.signJWT({
						//   id: user.id,
						//   userAgent: userAgent.ua,
						//   browser: userAgent.browser.name,
						//   device: this.buildDeviceName(userAgent),
						//   clientIp,
						// }, '1d', 'HS256', key, 'user.login', user.email);
						// await this.redis.setex(`${newDeviceTokenPrefix}${user.id}_${userAgent.browser.name}`, 60 * 60 * 24, deviceToken);
						// await ctx.call('mail.sendMail', {
						//   to: user.email,
						//   template: 'NEW_DEVICE_CONFIRMATION',
						//   data: {
						//     token: deviceToken,
						//   },
						// });

						// return new ResponseData(true, 'SUCCESS', {
						//   id: user.id
						// }, LANGs.REQUEST_LOGIN_SENT);
					}
					// password not match
					throw new MoleculerError(
						"Login failed!",
						500,
						LANGs.WRONG_EMAIL_OR_PASSWORD
					);
				}
				// email not found
				throw new MoleculerError(
					"Login failed!",
					500,
					LANGs.WRONG_EMAIL_OR_PASSWORD
				);
			},
		},
		logout: {
			params: {
				token: {
					type: "string",
				},
			},
			async handler(ctx) {
				try {
					console.log("token",ctx.params.token);
					const publicKey = Buffer.from(
						process.env.AUTH_PUBLIC_KEY ||
							"LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlHZk1BMEdDU3FHU0liM0RRRUJBUVVBQTRHTkFEQ0JpUUtCZ1FEV2QzNHZWZ1RPNXUvOUFMaUpKRjF6UDlMNgpsVm1HU1dFZWN0ZWdsVHFZWDIySkx3aklrTmQySzBLVjUzTWVoY3J5dHlUR1FtdWYyZGQzMDl0Y2hBSGp0ZmV6Ck43Tkwzckcwek5ReDdBM3dJVi9IaDRlU0g4OWF1S2JJeFNxaWl2MFJ2a2ZYMmZ3N0ZDQzBlb0tsVWExM1NDb3oKZTJXNTJsaUZsU1M1RFRwT1d3SURBUUFCCi0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQo=",
						"base64"
					).toString("utf-8");
					const tokenInfo = tokenHelper.verify(
						ctx.params.token,
						publicKey
					);
					console.log("logout",tokenInfo);
					this.logger.info("decoded token: ", tokenInfo);

					await this.redis.del(
						`${accessTokenPrefix}${tokenInfo.loginId}`
					);
				} catch (error) {
					this.logger.error("Logout error: ", error);
				}

				return new ResponseData(true, "SUCCESS", null);
			},
		},
		refreshJwtToken: {
			params: {
				refresh_token: {
					type: "string",
				},
			},
			async handler(ctx) {
				try {
					let { refresh_token: refreshToken } = ctx.params;
					console.log("refesh-token",refreshToken);
					const secretKey = Buffer.from(
						AUTH_PRIVATE_KEY,
						"base64"
					).toString("utf-8");
					const key = HS256_KEY || "secret";
					const decoded = tokenHelper.verify(refreshToken, key);
					console.log("decode",decoded);
					if (decoded) {
						const redisToken = await this.redis.get(
							`${refreshTokenPrefix}${decoded.loginId}`
						);
						if (redisToken !== refreshToken) {
							throw new MoleculerError(
								"Token expired",
								403,
								LANGs.TOKEN_EXPIRED,
								[]
							);
						}
						console.log("decode",decoded);
						const userData = await this.mysql.query(
							`select * from account INNER JOIN account_info 
							ON account.id = account_info.accountId
							WHERE account.id = ? `,
							[decoded.id]
						).then(res => res[0]);
						const token = tokenHelper.signJWT(
							{
								...userData,
								loginId: decoded.loginId,
							},
							accessTokenExp,
							"RS256",
							secretKey,
							"user.login",
							decoded.sub
						);
						refreshToken = tokenHelper.signJWT(
							{
								id: decoded.id,
								loginId: decoded.loginId,
							},
							refreshTokenExp,
							"HS256",
							key,
							"user.login",
							decoded.sub
						);

						await this.redis.setex(
							`${accessTokenPrefix}${decoded.loginId}`,
							60 * 60,
							token
						);
						await this.redis.setex(
							`${refreshTokenPrefix}${decoded.loginId}`,
							60 * 60,
							refreshToken
						);

						return new ResponseData(
							true,
							"Refresh token success!",
							{
								token,
								refresh_token: refreshToken,
							},
							"SUCCESS"
						);
					}
				} catch (error) {
					ctx.broker.logger.error(
						"refresh jwt: error when decode token: ",
						error
					);
					if (error.name === "TokenExpiredError") {
						throw new MoleculerError(
							"Token expired",
							403,
							LANGs.TOKEN_EXPIRED
						);
					}
				}
				throw new MoleculerError(
					"Invalid token!",
					403,
					LANGs.TOKEN_INVALID,
					[]
				);
			},
		},
		getDeviceTokenInfo: {
			params: {
				t: {
					type: "string",
					require: true,
				},
			},
			async handler(ctx) {
				try {
					const { t: token } = ctx.params;
					const decoded = await this.redis
						.get(token)
						.then(JSON.parse);
					if (decoded == null) {
						return {
							success: 0,
						};
					}
					return {
						success: 1,
						data: decoded,
					};
				} catch (e) {
					return {
						success: 0,
					};
				}
			},
		},
		acceptNewUserAgent: {
			params: {
				t: {
					type: "string",
					require: true,
				},
			},
			async handler(ctx) {
				try {
					const { t: token } = ctx.params;
					const decoded = await this.redis
						.get(token)
						.then(JSON.parse);
					this.logger.info("DECODED TOKEN", decoded);
					if (decoded) {
						this.logger.info(
							"acceptNewUserAgent decoded token: ",
							token
						);
						const {
							user_id,
							userAgent,
							browser,
							deviceName,
							clientIp,
						} = decoded;
						const loginRecord = await this.postgre.query(
							`INSERT INTO login_history (ip, user_agent, browser_name, device_name, user_id)
              VALUES ($1, $2, $3, $4, $5) RETURNING id`,
							[
								this.utcTimestamp(),
								clientIp,
								userAgent,
								browser,
								deviceName,
								user_id,
							]
						);
						this.logger.info(
							"accept new useragent : ",
							loginRecord.rows[0]
						);
						await this.redis.del(token);
						this.socketBroadcast({
							event: "NEW_DEVICE_CONFIRMED",
							rooms: ["new_device_confirmed/" + user_id],
							args: [],
						});

						return new ResponseData(
							true,
							"Accept new User Agent success!",
							null,
							"SUCCESS"
						);
					}
				} catch (error) {
					ctx.broker.logger.error(
						"accept new user agent: error when decode token: ",
						error
					);
					if (error.name === "TokenExpiredError") {
						throw new MoleculerError(
							"Token expired",
							401,
							LANGs.TOKEN_EXPIRED
						);
					}
				}
				throw new MoleculerError(
					"Invalid token!",
					401,
					LANGs.TOKEN_INVALID,
					[]
				);
			},
		},
		secretPage: {
			params: {},
			authenticate: true,
			async handler(ctx) {
				this.logger.info("secret page: ", ctx.params);
			},
		},
		enable2FA: {
			authenticate: true,
			params: {
				secret: "string|require",
				code: "string|require",
				email_code: "number|convert|require",
			},
			async handler(ctx) {
				const { secret, code, email_code } = ctx.params;
				const { userId } = ctx.meta;
				if (!userId) {
					return this.throwUserError();
				}
				const MAIL_CODE_KEY = "enable_2fa:" + userId;
				const isValidEmailCode = await ctx.call("mail-code.compare", {
					code: email_code,
					name: MAIL_CODE_KEY,
				});
				if (!isValidEmailCode) {
					throw new MoleculerError(
						"Your email verification code is wrong.",
						422,
						LANGs.EMAIL_VERIFICATION_CODE_WRONG,
						[]
					);
				}
				if (secret.length < 16) {
					throw new MoleculerError(
						"Secret Invalid",
						422,
						LANGs.SECRET_INVALID,
						[]
					);
				}
				const verifyCode = authenticator.verifyToken(secret, code);
				const key = HS256_KEY || "secret";
				this.logger.info(verifyCode);
				if (verifyCode && verifyCode.delta === 0) {
					const getUser = await this.postgre.query(
						"SELECT enable_2fa,email FROM users WHERE id = $1",
						[userId]
					);
					if (getUser && getUser.rows.length === 0) {
						throw new MoleculerError(
							"User Not Found",
							500,
							LANGs.USER_NOT_FOUND,
							[]
						);
					}
					if (getUser && getUser.rows[0].enable_2fa) {
						throw new MoleculerError(
							"2FA Already Enabled",
							500,
							LANGs.TWO_FA_ALREADY_ENABLED,
							[]
						);
					}
					await this.postgre.query(
						`
          UPDATE users
          SET two_factor_secret = $2, enable_2fa = true
          WHERE id = $1`,
						[userId, secret]
					);
					// const twoFaVerifyToken = await tokenHelper.signJWT({
					//   userId,
					//   email: getUser.rows[0].email,
					// }, '15m', 'HS256', key);
					// await this.redis.setex(`${twoFactorAuthenticationPrefix}${userId}`, 900, twoFaVerifyToken);
					// this.logger.info('twoFaVerifyToken', twoFaVerifyToken);
					// // call email service
					// await ctx.call('mail.sendMail', {
					//   to: getUser.rows[0].email,
					//   subject: 'Verify Two Factor Authentication Confirmation',
					//   template: 'VERIFY_ENABLE_2FA',
					//   data: {
					//     link: 'http://google.com/add-some-link-to-this',
					//     token: twoFaVerifyToken,
					//   },
					// });
					await ctx.call("mail-code.del", {
						name: MAIL_CODE_KEY,
					});
					return new ResponseData(true, "SUCCESS", {});
				}
				throw new MoleculerError(
					"Authentication Error",
					500,
					LANGs.TWO_FA_CODE_WRONG,
					[]
				);
			},
		},
		verifyEnable2FA: {
			params: {
				token: {
					type: "string",
				},
			},
			async handler(ctx) {
				const { token } = ctx.params;
				const key = HS256_KEY || "secret";
				const decodedToken = await tokenHelper.verify(token, key);
				if (decodedToken) {
					this.logger.info("decodedToken", decodedToken);
					const redisToken = await this.redis.get(
						`${twoFactorAuthenticationPrefix}${decodedToken.id}`
					);
					this.logger.info("redisToken", redisToken);
					if (redisToken === null) {
						throw new MoleculerError(
							"Token Expired",
							500,
							LANGs.TOKEN_EXPIRED,
							[]
						);
					}
					if (token !== redisToken) {
						throw new MoleculerError(
							"Token Invalid",
							500,
							LANGs.TOKEN_INVALID,
							[]
						);
					}
					const getUser = await this.postgre.query(
						"SELECT * FROM users WHERE id = $1",
						[decodedToken.id]
					);
					if (getUser && getUser.rows.length === 0) {
						throw new MoleculerError(
							"User Not Found",
							500,
							LANGs.USER_NOT_FOUND,
							[]
						);
					}
					const updateInfo = await this.postgre.query(
						`
            UPDATE users
            SET enable_2fa = $2
            WHERE email = $1`,
						[decodedToken.email, "true"]
					);
					this.logger.info(updateInfo);
					await this.redis.del(
						`${twoFactorAuthenticationPrefix}${decodedToken.id}`
					);
					await this.broker.cacher.del(
						`user.getIsUserEnable2FA:${decodedToken.id}`
					);

					return new ResponseData(true, "SUCCESS", {});
				}
				throw new MoleculerError(
					"Invalid Token",
					500,
					LANGs.TOKEN_INVALID,
					[]
				);
			},
		},
		loginWith2fa: {
			params: {
				token: {
					type: "string",
					require: true,
				},
				code: {
					type: "string",
					require: true,
				},
			},
			async handler(ctx) {
				const { token, code } = ctx.params;
				const { parsedUserAgent: userAgent, clientIp } = ctx.meta;
				console.log("userAgent", userAgent);
				const secretKey = Buffer.from(
					AUTH_PRIVATE_KEY,
					"base64"
				).toString("utf-8");
				const key = HS256_KEY || "secret";
				let decodedToken;
				try {
					decodedToken = tokenHelper.verify(token, key);
				} catch (e) {
					throw new MoleculerError(
						"Token Expired",
						500,
						LANGs.TOKEN_EXPIRED
					);
				}
				if (decodedToken) {
					const userInfo = await this.postgre.query(
						"SELECT * FROM users WHERE id = $1",
						[decodedToken.id]
					);
					if (userInfo && userInfo.rows.length === 0) {
						throw new MoleculerError(
							"User Not Found",
							500,
							LANGs.USER_NOT_FOUND,
							[]
						);
					}
					let user = userInfo.rows[0];
					console.log("user", user);
					const verifyCode = authenticator.verifyToken(
						user.two_factor_secret,
						code
					);
					if (verifyCode && verifyCode.delta === 0) {
						const loginRecord = await this.postgre.query(
							`INSERT INTO login_history (ip, user_agent, browser_name, device_name, user_id)
            VALUES ($1, $2, $3, $4, $5) RETURNING id`,
							[
								Date.now(),
								clientIp,
								userAgent.ua,
								userAgent.browser.name,
								`${userAgent.device.vendor}_${userAgent.device.model}`,
								user.id,
							]
						);
						// login success
						user = safeUser(user);
						const newToken = tokenHelper.signJWT(
							{
								...user,
								userData: user,
								loginId: loginRecord.rows[0].id,
							},
							"15m",
							"RS256",
							secretKey,
							"user.login",
							user.email
						);

						const refreshToken = tokenHelper.signJWT(
							{
								id: user.id,
								loginId: loginRecord.rows[0].id,
							},
							"1h",
							"HS256",
							key,
							"user.login",
							user.email
						);
						await this.redis.setex(
							`${accessTokenPrefix}${loginRecord.rows[0].id}`,
							60 * 60,
							newToken
						);
						await this.redis.setex(
							`${refreshTokenPrefix}${loginRecord.id}`,
							60 * 60,
							refreshToken
						);
						// delete user.password_salt;
						// delete user.password_hash;
						// delete user.two_factor_secret;
						// delete user.email_verified;
						// delete user.enable_2fa;
						const data = {
							user,
							token: newToken,
							refresh_token: refreshToken,
						};

						return new ResponseData(
							true,
							"SUCCESS",
							data,
							LANGs.LOGIN_SUCCESS
						);
					}
					throw new MoleculerError(
						"Authentication Error",
						500,
						LANGs.TWO_FA_CODE_WRONG,
						[]
					);
				}
				throw new MoleculerError(
					"Invalid Token",
					500,
					LANGs.TOKEN_INVALID,
					[]
				);
			},
		},

		getEmailById: {
			params: {
				user_id: "number|required",
			},
			cache: {
				ttl: 86400,
				keys: ["user_id"],
			},
			async handler(ctx) {
				const { user_id } = ctx.params;
				const { email } = await this.knex("users")
					.select("email")
					.where({
						id: user_id,
					})
					.first();
				return email;
			},
		},
		getIsUserEnable2FA: {
			params: {
				user_id: "number|required",
			},
			cache: {
				ttl: 86400,
				keys: ["user_id"],
			},
			async handler(ctx) {
				const { user_id } = ctx.params;
				const { enable_2fa } = await this.knex("users")
					.select("enable_2fa")
					.where({
						id: user_id,
					})
					.first();
				return enable_2fa;
			},
		},
		generate2FAVerifyCodeEnable2FA: {
			authenticate: true,
			async handler(ctx) {
				const { userId, user } = ctx.meta;
				if (!userId) {
					return this.throwUserError();
				}
				const name = `enable_2fa:${userId}`;
				await ctx.call("mail-code.generateCode", {
					name,
					email: user.email,
					email_template_name: "ENABLE_2FA",
				});
				return {
					success: true,
				};
			},
		},
		generate2FAVerifyCodeDisable2FA: {
			authenticate: true,
			async handler(ctx) {
				const { userId, user } = ctx.meta;
				if (!userId) {
					return this.throwUserError();
				}
				console.log("here is user", user);
				const name = `disable_2fa:${userId}`;
				await ctx.call("mail-code.generateCode", {
					name,
					email: user.email,
					email_template_name: "DISABLE_2FA",
				});
				return {
					success: true,
				};
			},
		},
		disable2FA: {
			authenticate: true,
			params: {
				email_code: "number|require|convert",
				code: "string|min:6|require",
			},
			async handler(ctx) {
				try {
					const { code, email_code } = ctx.params;
					const { userId } = ctx.meta;
					if (!userId) {
						return this.throwUserError();
					}
					const MAIL_CODE_KEY = "disable_2fa:" + userId;
					const isValidEmailCode = await ctx.call(
						"mail-code.compare",
						{
							code: email_code,
							name: MAIL_CODE_KEY,
						}
					);
					if (!isValidEmailCode) {
						throw new MoleculerError(
							"Your email verification code is wrong.",
							422,
							LANGs.EMAIL_VERIFICATION_CODE_WRONG,
							[]
						);
					}
					const twoFaCodeValid = await this.verify2FACode(
						userId,
						code
					);
					if (twoFaCodeValid) {
						await this.knex("users")
							.where({
								id: userId,
							})
							.update({
								enable_2fa: false,
							});
						return {
							success: true,
						};
					} else {
						throw new MoleculerError(
							"2FA code wrong",
							422,
							LANGs.TWO_FA_CODE_WRONG,
							[]
						);
					}
				} catch (e) {
					this.actionThrowError("disable2FA", e);
				}
			},
		},
	},

	events: {},

	methods: {
		async verify2FACode(userId, code) {
			const two_factor_secret = await this.knex("users")
				.select("two_factor_secret")
				.where({
					id: userId,
				})
				.first()
				.then((user) => user.two_factor_secret);
			const verifyCode = authenticator.verifyToken(
				two_factor_secret,
				code
			);
			return verifyCode && verifyCode.delta === 0;
		},
		buildDeviceName(userAgentData) {
			return userAgentData.device.vendor
				? userAgentData.device.vendor +
						"_" +
						(userAgentData.device.model || "")
				: userAgentData.browser.name + "_" + userAgentData.os.name;
		},

		async sendMailVerifyEmailAddress(userData) {
			const redisCacheKey = VERIFY_EMAIL_PREFIX + "u" + userData.id;
			const mailToken =
				(await this.redis.get(redisCacheKey).then((key) => {
					const randomToken = md5(this.randomString(32));
					return (
						key ||
						this.redis
							.setex(redisCacheKey, 86400, randomToken)
							.then(() => randomToken)
					);
				})) +
				"u" +
				userData.id;

			const redisKey = VERIFY_EMAIL_PREFIX + mailToken;
			const lastSendKey = "lastsend" + redisKey;
			const checkTll = await this.redis.ttl(lastSendKey).then(Number);
			if (checkTll > 0) {
				throw new MoleculerError(
					"Please wait 2 minutes from last request.",
					500,
					LANGs.NEED_WAIT_2_MIN_TO_SEND_MAIL,
					[]
				);
			}
			await this.redis.setex(lastSendKey, 60 * 2, "1");
			await this.redis.setex(
				redisKey,
				15 * 60 * 2,
				JSON.stringify(userData)
			);
			await this.broker.call("mail.sendMail", {
				to: userData.email,
				template: "VERIFY_EMAIL",
				data: {
					token: mailToken,
				},
			});
		},
	},
};

module.exports = schema;
