const Redis = require('ioredis');
const { REDIS_HOST, REDIS_PORT } = process.env;
const redisInstance = new Redis(process.env.REDIS_URL);
module.exports = {
    redisInstance,
    getInstance: () => redisInstance
}
