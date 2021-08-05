const APIGateway = require("moleculer-web");
const cors = require("cors");
const http = require("http");
const uaParser = require("ua-parser-js");
const Fingerprint = require("express-fingerprint");
const tokenHelper = require("../lib/token");
const socketMixin = require("../mixins/socket.mixin");
const multer = require("../lib/ multer");

/**
 * @type {import('moleculer').Service}
 */
const schema = {
	name: "api-gateway",
	mixins: [APIGateway, socketMixin],
	settings: {
		port: process.env.PORT || 3000,
		use: [
			cors({
				origin: "*",
			}),
			Fingerprint({
				parameters: [
					// Defaults
					Fingerprint.useragent,
					Fingerprint.acceptHeaders,
					Fingerprint.geoip,
				],
			}),
		],
		cors: {
			origin: "*", //Moleculer-io only pick up this option and set it to io.origins()
			methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
			allowedHeaders: [],
			exposedHeaders: [],
			credentials: false,
			maxAge: 3600,
		},
		ip: "0.0.0.0",
		// Logging request parameters with 'info' level
		logRequestParams: "info",

		// Logging response data with 'debug' level
		logResponseData: "debug",

		// Use body-parser module
		bodyParsers: {
			json: true,
			urlencoded: {
				extended: true,
			},
		},
		routes: [
			{
				path: "/id-verification-upload",
				// You should disable body parsers
				bodyParsers: {
					json: false,
					urlencoded: false,
				},

				aliases: {
					"PUT /api/media/upload": "media.upload",
					// File upload from HTML multipart form
					"POST /": "multipart:id-verification.submit",
					// File upload from AJAX or cURL
					"PUT /:id": "stream:id-verification.submit",
					// File upload from HTML form and overwrite busboy config
					"POST /multi": {
						type: "multipart",
						// Action level busboy config
						busboyConfig: {
							limits: { files: 3 },
						},
						action: "id-verification.submit",
					},
				},
				busboyConfig: {
					limits: { files: 1 },
				},

				mappingPolicy: "restrict",
			},
			{
				path: "api",
				bodyParsers: {
					json: true,
					urlencoded: {
						extended: true,
					},
				},
				mappingPolicy: "restrict",
				use: [],
				aliases: {
					"GET test": "auth.test",
					"POST user/register": "auth.register",
					"POST user/login": "auth.login",
				},
				onBeforeCall(ctx, route, req) {
					const finger = req.Fingerprint;
					ctx.meta.fingerprint = req.fingerprint;
					const publicKey = Buffer.from(
						process.env.AUTH_PUBLIC_KEY ||
							"LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlHZk1BMEdDU3FHU0liM0RRRUJBUVVBQTRHTkFEQ0JpUUtCZ1FEV2QzNHZWZ1RPNXUvOUFMaUpKRjF6UDlMNgpsVm1HU1dFZWN0ZWdsVHFZWDIySkx3aklrTmQySzBLVjUzTWVoY3J5dHlUR1FtdWYyZGQzMDl0Y2hBSGp0ZmV6Ck43Tkwzckcwek5ReDdBM3dJVi9IaDRlU0g4OWF1S2JJeFNxaWl2MFJ2a2ZYMmZ3N0ZDQzBlb0tsVWExM1NDb3oKZTJXNTJsaUZsU1M1RFRwT1d3SURBUUFCCi0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQo=",
						"base64"
					).toString("utf-8");

					// Set request headers to context meta
					const ua = req.headers["user-agent"];
					ctx.meta.body = req.body;
					ctx.meta.userAgent = ua;
					ctx.meta.parsedUserAgent = uaParser(ua);

					ctx.meta.clientIp =
						req.headers["x-forwarded-for"] ||
						req.connection.remoteAddress ||
						req.socket.remoteAddress ||
						req.connection.socket.remoteAddress ||
						"localhost";
				},
			},
			{
				bodyParsers: {
					json: true,
					urlencoded: {
						extended: true,
					},
				},
				path: "/api",
				use: [
					multer.single("file"),
					cors({
						origin: "*",
					}),
				],
				mappingPolicy: "restrict",
				aliases: {
					health: "$node.health",
					//USER
					"POST user/login": "auth.login",
					"POST users/register": "auth.register",
					"POST user/register": "auth.register",
					"POST users/reset_password": "auth.resetPassword",
					"POST user/reset_password": "auth.resetPassword",
					"POST user/check_reset_password_token":
						"user.checkResetPasswordTokenExist",
					"POST users/forgot_password": "auth.forgotPassword",
					"POST user/forgot_password": "auth.forgotPassword",

					"POST users/refresh_token": "auth.refreshJwtToken",
					"PUT user/update": "user.updateProfile",
					"GET user/profile": "user.getProfile",
					"PUT user/profile": "user.updateProfile",
					"PUT user/avatar": "user.updateAvatar",
					"PUT user/background": "user.updateBackground",
					"PUT user/changePassword": "user.changePassword",
					"POST user/logout": "auth.logout",
					"GET user/email/:email": "user.getByEmail",
					"GET accounts": "user.getAll",
					"GET contacts": "user.getAllConatct",

					//Post apis
					"POST post": "post.newPost",
					"GET post": "post.getAllPost",
					"GET post/:id": "post.getPostById",
					"PUT post:id": "post.updatePost",
					"GET mypost": "post.getAllPostByUser",
					"GET history": "post.getNotiPost",
					"DELETE post:id": "post.deletePost",
					//interactive
					"POST like": "post.likePost",
					"POST comment": "post.addComment",

					//media
					"PUT media/upload": "media.upload",
					"GET images": "media.getAll",
					//chat
					"POST chat": "chat.sendMessage",
					"GET chat": "chat.getChatHistory",
				},
				onBeforeCall(ctx, route, req) {
					// console.log("req_params")
					const finger = req.Fingerprint;
					ctx.meta.fingerprint = req.fingerprint;
					const publicKey = Buffer.from(
						process.env.AUTH_PUBLIC_KEY ||
							"LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlHZk1BMEdDU3FHU0liM0RRRUJBUVVBQTRHTkFEQ0JpUUtCZ1FEV2QzNHZWZ1RPNXUvOUFMaUpKRjF6UDlMNgpsVm1HU1dFZWN0ZWdsVHFZWDIySkx3aklrTmQySzBLVjUzTWVoY3J5dHlUR1FtdWYyZGQzMDl0Y2hBSGp0ZmV6Ck43Tkwzckcwek5ReDdBM3dJVi9IaDRlU0g4OWF1S2JJeFNxaWl2MFJ2a2ZYMmZ3N0ZDQzBlb0tsVWExM1NDb3oKZTJXNTJsaUZsU1M1RFRwT1d3SURBUUFCCi0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQo=",
						"base64"
					).toString("utf-8");

					// Set request headers to context meta
					const ua = req.headers["user-agent"];
					ctx.meta.userAgent = ua;
					ctx.meta.parsedUserAgent = uaParser(ua);

					//    console.log('headers',req.headers);
					ctx.meta.clientIp =
						req.headers["x-forwarded-for"] ||
						req.connection.remoteAddress ||
						req.socket.remoteAddress ||
						req.connection.socket.remoteAddress ||
						"localhost";
					const bearerToken = req.headers.authorization || "";
					//const bearerToken = req.body.token
					if (req.file) {
						ctx.meta.file = req.file;
					}
					if (bearerToken) {
						ctx.meta.token = bearerToken
							.replace("Bearer", "")
							.trim();
						try {
							const user = tokenHelper.verify(
								ctx.meta.token,
								publicKey
							);
							ctx.meta.user = user;
						} catch (error) {
							console.log("api error", error);
							
						}
					}
				},
			},
		],
		assets: {
			// Root folder of assets
			folder: "uploads",

			// Options to `server-static` module
			options: {},
		},
		onError(req, res, err) {
			const { message, data, type, code } = err;
			res.setHeader("Content-type", "application/json; charset=utf-8");
			const httpCodes = Object.keys(http.STATUS_CODES);
			if (httpCodes.includes(String(code))) {
				res.writeHead(err.code);
			} else res.writeHead(500);
			// Return with the error as JSON object

			if (err.code === 422) {
				const resData = err.data.map((d) => ({
					type: d.type,
					field: d.field,
					message: d.message,
					actual: d.actual,
				}));

				res.end(
					JSON.stringify(
						{
							success: false,
							data: resData,
							msg: err.message,
							type: err.type,
						},
						null,
						2
					)
				);
			} else if (err.code === 401) {
				const resData = err.data.map((d) => ({
					type: d.type,
					field: d.field,
					message: d.message,
					actual: d.actual,
				}));
				res.end(
					JSON.stringify(
						{
							success: false,
							data: resData,
							msg: err.message,
							type: err.type,
						},
						null,
						2
					)
				);
			} else if (err.code === 504) {
				console.log("errdâdadada", err);
				res.end(
					JSON.stringify(
						{
							success: false,
							data: "",
						},
						null,
						2
					)
				);
			} else {
				res.end(
					JSON.stringify(
						{
							msg: message,
							data,
							success: false,
							type,
							// err
						},
						null,
						2
					)
				);
			}
			this.logResponse(req, res, err ? err.ctx : null);
		},
		io: {
			namespaces: {
				"/": {
					// authorization: true,
					events: {
						call: {
							whitelist: [
								"chat.*", // TODO: must login to send message
								//TODO: remove
								"crash.reuseHashes",
								"crash.startGame",
								"crash.stopGame",
							],
						},
					},
				},
				"/crash": {
					authorization: true,
					events: {
						call: {
							whitelist: ["crash.bet", "crash.cashOut"],
						},
					},
				},
			},
			options: {
				origins: "*:*",
				handlePreflightRequest: (req, res) => {
					this.logger.info("handlePreflightRequest");
				},
			},
		},
	},
	methods: {
	},
	created() {
	},
};

module.exports = schema;
