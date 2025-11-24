"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = void 0;
// src/config/session.ts
const connect_redis_1 = require("connect-redis");
const express_session_1 = __importDefault(require("express-session"));
// import { RedisStore } from "connect-redis";
const redis_1 = require("redis");
// Initialize client.
const redisClient = (0, redis_1.createClient)();
redisClient.connect().catch(console.error);
// Initialize store.
const redisStore = new connect_redis_1.RedisStore({
    client: redisClient,
    prefix: "auth:",
});
const isProd = process.env.NODE_ENV === "production";
const isHttps = isProd && process.env.FORCE_HTTPS === "true";
exports.sessionMiddleware = (0, express_session_1.default)({
    store: redisStore,
    // name: process.env.SESSION_NAME || "sid",
    secret: process.env.SESSION_SECRET || "change_me_in_prod",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: isHttps ? true : false, // true only when serving over HTTPS
        maxAge: 1000 * 60 * 60 * 24 * 30,
    },
});
