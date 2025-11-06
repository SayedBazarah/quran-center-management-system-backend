// src/config/redis.ts
import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
export const redisClient = createClient({ url: REDIS_URL });

export async function initRedis(): Promise<void> {
  redisClient.on("error", (err) => console.error("[redis] error", err));
  if (!redisClient.isOpen) await redisClient.connect();
  console.log("[redis] connected");
}
