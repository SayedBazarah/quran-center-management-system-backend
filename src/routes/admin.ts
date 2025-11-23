// src/routes/adminRoutes.ts
import { Router } from "express";
import * as controllers from "@/controllers";
import * as validators from "@/validators";
import {
  isAuthenticated,
  requirePermissions,
  uploadSingle,
  normalizeFormDataArrays,
} from "@/middlewares";
import { GlobalPermissionCode } from "@/bootstrap/permissionSeeds";

const AdminRouter = Router();

AdminRouter.post(
  "/",
  isAuthenticated,
  requirePermissions(GlobalPermissionCode.CreateAdmin),
  validators.createAdmin,
  controllers.createAdmin
);
AdminRouter.get(
  "/",
  isAuthenticated,
  requirePermissions(GlobalPermissionCode.ReadAdmin),
  controllers.listAdmins
);

AdminRouter.patch(
  "/:id",
  isAuthenticated,
  requirePermissions(GlobalPermissionCode.UpdateAdmin),
  validators.updateAdmin,
  controllers.updateAdminById
);

AdminRouter.delete(
  "/:id",
  isAuthenticated,
  requirePermissions(GlobalPermissionCode.DeleteAdmin),
  validators.deleteAdmin,
  controllers.deleteAdminById
);

export default AdminRouter;
