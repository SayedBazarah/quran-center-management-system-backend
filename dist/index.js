import "dotenv/config";
import app from "./app";
import { env } from "./env";
// import { initRedis } from "./config/redis";
import connectDB from "./config/mongodb";
import { seedSuperAdmin } from "./bootstrap/seedSuperAdmin";
import { initBaseFolders } from "./utils/file";
import { scheduleJobs } from "./jobs/schedule";
const port = env.port;
const server = app.listen(port, async () => {
    await connectDB();
    // await initRedis();
    await seedSuperAdmin();
    scheduleJobs();
    await initBaseFolders();
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
//# sourceMappingURL=index.js.map