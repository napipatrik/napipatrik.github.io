'use strict';

const KEEP_MESSAGES = process.env.DB_KEEP_MESSAGES || 20;
let client = null;

initRedis();

exports.storeMessage = async function (server, channel, message) {
  if (!client) {
    return;
  }

  return client.lPush(`${server}:${channel}`, message)
    .then(() => {
      client.lTrim(`${server}:${channel}`, 0, KEEP_MESSAGES - 1);
    });
}

exports.getMessagesForChannel = async function (server, channel) {
  if (!client) {
    return [];
  }

  return client.lRange(`${server}:${channel}`, 0, -1);
}

function initRedis() {
  import('@redis/client')
    .then(redisModule => {
      return redisModule.createClient({url: process.env.REDIS_URL ?? 'redis://localhost:6379'})
        .on("error", (err) => console.log("Redis Client Error", err))
        .connect();
    })
    .then(redisClient => {
      client = redisClient;
      console.log('Redis client connected');
    });
}
