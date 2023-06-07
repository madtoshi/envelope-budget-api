const redisClient = require("../config/redis-config");

// Deletes all data in Redis cache
const flushCache = () => {
    return redisClient.flushall('ASYNC');
}

module.exports = {
    flushCache
}