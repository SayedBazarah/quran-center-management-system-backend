"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const env_1 = require("./env");
// import { initRedis } from "./config/redis";
const mongodb_1 = __importDefault(require("./config/mongodb"));
const seedSuperAdmin_1 = require("./bootstrap/seedSuperAdmin");
const file_1 = require("./utils/file");
const schedule_1 = require("./jobs/schedule");
const port = env_1.env.port;
const server = app_1.default.listen(port, async () => {
    await (0, mongodb_1.default)();
    // await initRedis();
    await (0, seedSuperAdmin_1.seedSuperAdmin)();
    (0, schedule_1.scheduleJobs)();
    await (0, file_1.initBaseFolders)();
    /* eslint-disable no-console */
    console.log(`Listening: http://localhost:${port}`);
    /* eslint-enable no-console */
});
server.on("error", async (err) => {
    if ("code" in err && err.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use. Please choose another port or stop the process using it.`);
    }
    else {
        console.error("Failed to start server:", err);
    }
    process.exit(1);
});
const shutdown = async () => {
    // await prisma.$disconnect();
    // await redisClient.quit();
    // console.log("🧹 Clean shutdown");
    // process.exit(0);
};
["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
    process.on(signal, shutdown);
});
