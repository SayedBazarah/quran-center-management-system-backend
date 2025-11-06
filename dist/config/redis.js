"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
exports.initRedis = initRedis;
// src/config/redis.ts
const redis_1 = require("redis");
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
exports.redisClient = (0, redis_1.createClient)({ url: REDIS_URL });
async function initRedis() {
    exports.redisClient.on("error", (err) => console.error("[redis] error", err));
    if (!exports.redisClient.isOpen)
        await exports.redisClient.connect();
    console.log("[redis] connected");
}
