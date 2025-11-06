// src/jobs/schedule.ts
import cron from "node-cron";
import { markLateEnrollmentsJob } from "./tasks/markLateEnrollments";

export function scheduleJobs() {
  // Run every day at 02:00 local server time
  cron.schedule(
    "* 0 2 * * *",
    async () => {
      try {
        console.log("[cron] started");
        const res = await markLateEnrollmentsJob();
        console.log("[cron] markLateEnrollments", res);
      } catch (e) {
        console.error("[cron] markLateEnrollments failed", e);
      }
    },
    {
      timezone: process.env.TZ || "Africa/Cairo", // set to your preferred zone, e.g. 'Africa/Cairo'
    }
  );
}
