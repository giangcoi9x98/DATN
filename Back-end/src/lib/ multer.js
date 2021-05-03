const multer = require("multer");
const fs = require("fs");
const tokenHelper = require("./token");
const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, "uploads/");
	},
	filename(req, file, cb) {
		const publicKey = Buffer.from(
			process.env.AUTH_PUBLIC_KEY ||
				"LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlHZk1BMEdDU3FHU0liM0RRRUJBUVVBQTRHTkFEQ0JpUUtCZ1FEV2QzNHZWZ1RPNXUvOUFMaUpKRjF6UDlMNgpsVm1HU1dFZWN0ZWdsVHFZWDIySkx3aklrTmQySzBLVjUzTWVoY3J5dHlUR1FtdWYyZGQzMDl0Y2hBSGp0ZmV6Ck43Tkwzckcwek5ReDdBM3dJVi9IaDRlU0g4OWF1S2JJeFNxaWl2MFJ2a2ZYMmZ3N0ZDQzBlb0tsVWExM1NDb3oKZTJXNTJsaUZsU1M1RFRwT1d3SURBUUFCCi0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQo=",
			"base64"
		).toString("utf-8");
		const bearerToken = req.headers.authorization || "";
		let user;
		if (bearerToken) {
			user = tokenHelper.verify(bearerToken, publicKey);
		}
		const originalnameArr = file.originalname.split(".");
		console.log(originalnameArr);
		const ext = originalnameArr[originalnameArr.length - 1];
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		// cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);

		const path = `./uploads/${user.email}`;
		fs.mkdirSync(path, { recursive: true });

		cb(null, `${user.email}/${file.originalname}`);
	},
});

module.exports = multer({ storage });
