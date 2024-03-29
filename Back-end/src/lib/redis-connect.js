// require("dotenv").config();
const Redis = require("ioredis");
const { REDIS_HOST, REDIS_PORT } = process.env;
const redisInstance = new Redis({
	host: REDIS_HOST,
	port: REDIS_PORT,
});
module.exports = {
	redisInstance,
	getInstance: () => redisInstance,
};
