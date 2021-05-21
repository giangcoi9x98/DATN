"use strict";
const CommonMixin = require("../mixins/common.mixin");
const ResponseData = require("../lib/response");
const { MoleculerError } = require("moleculer").Errors;
const fs = require("fs");

module.exports = {
	name: "media",
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
		upload: {
			async handler(ctx) {
				try {
					return new ResponseData(true, "Success", {
						link: "/uploads/" + ctx.meta.file.filename,
					});
				} catch (error) {
					this.logger.error("Error media servirce", error);
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
				email: "string"
			},
			async handler(ctx) {
				try {
					const { email } = ctx.params;
					const files = fs.readdirSync(`uploads/${email}`);
					const filterFiles = files.filter(e => e !== ".DS_Store");
					const res = filterFiles.map(e => `${email}/${e}`);
					return new ResponseData(true, "Success", res);
				} catch (error) {
					this.logger.error("Error media servirce", error);
					return new ResponseData(true, "Success", []);

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
