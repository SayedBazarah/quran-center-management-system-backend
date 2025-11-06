// src/routes/adminRoutes.ts
import { Router } from "express";
import * as controllers from "@/controllers";
import { isAuthenticated, requirePermissions } from "@/middlewares";
import { GlobalPermissionCode } from "@/bootstrap/permissionSeeds";
const AnalyticsRouter = Router();
AnalyticsRouter.get("/", isAuthenticated, requirePermissions(GlobalPermissionCode.ReadReports), controllers.globalAnalytics);
AnalyticsRouter.get("/logs", isAuthenticated, requirePermissions(GlobalPermissionCode.ReadReports), controllers.globalLogs);
export default AnalyticsRouter;
//# sourceMappingURL=analytics.js.map