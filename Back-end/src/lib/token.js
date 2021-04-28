const jwt = require("jsonwebtoken");

function signJWT(data, expireTime, algorithm, key, issuer, subject) {
	return jwt.sign(data, key, {
		algorithm,
		expiresIn: expireTime || "1d",
		issuer: issuer || "user-service",
		subject: subject || "",
	});
}

function verify(token, key) {
	return jwt.verify(token, key);
}

module.exports = { signJWT, verify };
