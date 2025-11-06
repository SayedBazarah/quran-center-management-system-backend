"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleJobs = scheduleJobs;
// src/jobs/schedule.ts
const node_cron_1 = __importDefault(require("node-cron"));
const markLateEnrollments_1 = require("./tasks/markLateEnrollments");
function scheduleJobs() {
    // Run every day at 02:00 local server time
    node_cron_1.default.schedule("* 0 2 * * *", async () => {
        try {
            console.log("[cron] started");
            const res = await (0, markLateEnrollments_1.markLateEnrollmentsJob)();
            console.log("[cron] markLateEnrollments", res);
        }
        catch (e) {
            console.error("[cron] markLateEnrollments failed", e);
        }
    }, {
        timezone: process.env.TZ || "Africa/Cairo", // set to your preferred zone, e.g. 'Africa/Cairo'
    });
}
