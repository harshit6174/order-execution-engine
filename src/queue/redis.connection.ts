import IORedis from "ioredis";

let redis: IORedis | null = null;

if (process.env.REDIS_HOST) {
  redis = new IORedis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    maxRetriesPerRequest: null
  });

  redis.on("connect", () => {
    console.log("Redis connected");
  });

  redis.on("error", (err) => {
    console.error("Redis connection error", err);
  });
} else {
  console.log("Redis disabled (no REDIS_HOST)");
}

export default redis;
