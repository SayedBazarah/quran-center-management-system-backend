// src/routes/adminRoutes.ts
import { Router } from "express";
import * as controllers from "@/controllers";
import * as validators from "@/validators";
import { isAuthenticated, requirePermissions } from "@/middlewares";
import { GlobalPermissionCode } from "@/bootstrap/permissionSeeds";

const AnalyticsRouter = Router();

AnalyticsRouter.get(
  "/",
  isAuthenticated,
  requirePermissions(GlobalPermissionCode.ReadReports),
  validators.globalAnalytics,
  controllers.globalAnalytics
);
AnalyticsRouter.get(
  "/logs",
  isAuthenticated,
  requirePermissions(GlobalPermissionCode.ReadReports),
  controllers.globalLogs
);

export default AnalyticsRouter;
