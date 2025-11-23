// src/routes/teacherRoutes.ts
import { Router } from "express";
import * as controllers from "@/controllers";
import * as validators from "@/validators";
import * as middlewares from "@/middlewares";
import { GlobalPermissionCode } from "@/bootstrap/permissionSeeds";

const TeacherRouter = Router();

TeacherRouter.post(
  "/",
  middlewares.isAuthenticated,
  middlewares.requirePermissions(GlobalPermissionCode.CreateTeacher),
  validators.createTeacher,
  controllers.createTeacher
);

TeacherRouter.get(
  "/",
  middlewares.isAuthenticated,
  middlewares.requirePermissions(GlobalPermissionCode.ReadTeacher),
  controllers.listTeachers
);

TeacherRouter.patch(
  "/:id",
  middlewares.isAuthenticated,
  middlewares.requirePermissions(GlobalPermissionCode.UpdateTeacher),
  validators.updateTeacher,
  controllers.updateTeacherById
);
TeacherRouter.delete(
  "/:id",
  middlewares.isAuthenticated,
  middlewares.requirePermissions(GlobalPermissionCode.DeleteTeacher),
  validators.deleteTeacher,
  controllers.deleteTeacherById
);

export default TeacherRouter;
