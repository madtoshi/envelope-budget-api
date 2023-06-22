const redis = require('redis');

let redisClient;
(async () => {
    redisClient = redis.createClient({
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        username: process.env.REDIS_USER,
        password: process.env.REDIS_PASSWORD,
     });

    redisClient.on("error", (error) => console.error(`Error Redis: ${error}`));

    await redisClient.connect();
})();

module.exports.redisClient = redisClient; 