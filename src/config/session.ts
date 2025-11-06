// src/config/session.ts
import session from "express-session";
// import { RedisStore } from "connect-redis";
import { createClient } from "redis";
import MongoStore from "connect-mongo";
import { env } from "@/env";

// Initialize client.
const redisClient = createClient();
redisClient.connect().catch(console.error);

// Initialize store.
// const redisStore = new RedisStore({
//   client: redisClient,
//   prefix: "auth:",
// });

const isProd = process.env.NODE_ENV === "production";
const isHttps = isProd && process.env.FORCE_HTTPS === "true";

export const sessionMiddleware = session({
  // store: redisStore,
  store: MongoStore.create({
    mongoUrl: env.mongoDb.uri || "mongodb://127.0.0.1:27017/app-db", // db from URI is used
    // Optional: ttl, collectionName, stringify, autoRemove, mongoOptions, etc.
    // ttl: 60 * 60 * 24 * 30, // seconds; defaults to cookie.maxAge if set
    // collectionName: "sessions",
    // autoRemove: "interval",
    // autoRemoveInterval: 10, // minutes
  }),

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
