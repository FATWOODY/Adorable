import { createClient } from "redis";

// Use singleton pattern to prevent multiple Redis connections in development
declare global {
  var __redis: any;
  var __redisPublisher: any;
}

let redis: any;
let redisPublisher: any;

if (process.env.NODE_ENV === "production") {
  redis = createClient({
    url: process.env.REDIS_URL,
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  redisPublisher = createClient({
    url: process.env.REDIS_URL,
  })
    .on("error", (err) => console.log("Publisher Redis Client Error", err))
    .connect();
} else {
  if (!global.__redis) {
    global.__redis = createClient({
      url: process.env.REDIS_URL,
    })
      .on("error", (err) => console.log("Redis Client Error", err))
      .connect();
  }
  redis = global.__redis;

  if (!global.__redisPublisher) {
    global.__redisPublisher = createClient({
      url: process.env.REDIS_URL,
    })
      .on("error", (err) => console.log("Publisher Redis Client Error", err))
      .connect();
  }
  redisPublisher = global.__redisPublisher;
}

export { redis, redisPublisher };