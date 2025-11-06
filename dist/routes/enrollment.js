// src/routes/enrollmentRoutes.ts
import { Router } from "express";
import * as controllers from "@/controllers";
import * as validators from "@/validators";
import * as middlewares from "@/middlewares";
import { GlobalPermissionCode } from "@/bootstrap/permissionSeeds";
const EnrollmentRouter = Router();
// CRUD
EnrollmentRouter.post("/:studentId", middlewares.isAuthenticated, middlewares.requirePermissions(GlobalPermissionCode.CreateEnrollment), validators.createEnrollment, controllers.createEnrollment);
EnrollmentRouter.patch("/:id", middlewares.isAuthenticated, middlewares.requirePermissions(GlobalPermissionCode.UpdateEnrollment), validators.updateEnrollment, controllers.updateEnrollmentById);
EnrollmentRouter.delete("/:id", middlewares.isAuthenticated, middlewares.requirePermissions(GlobalPermissionCode.DeleteEnrollment), controllers.deleteEnrollmentById);
// Lists
EnrollmentRouter.get("/by-student/:studentId", middlewares.isAuthenticated, middlewares.requirePermissions(GlobalPermissionCode.ReadStudent), controllers.listEnrollmentsByStudent);
EnrollmentRouter.get("/pending", middlewares.isAuthenticated, middlewares.requirePermissions(GlobalPermissionCode.AcceptEnrollment), controllers.listPendingEnrollments);
EnrollmentRouter.get("/late", middlewares.isAuthenticated, middlewares.requirePermissions(GlobalPermissionCode.ReadStudent), controllers.listLateEnrollments);
// Actions
EnrollmentRouter.post("/:enrollmentId/status", middlewares.isAuthenticated, middlewares.requirePermissions(GlobalPermissionCode.AcceptEnrollment), validators.acceptEnrollment, controllers.enrollmentStatus);
EnrollmentRouter.post("/:id/close-graduated", middlewares.isAuthenticated, middlewares.requirePermissions(GlobalPermissionCode.UpdateEnrollment), controllers.closeEnrollmentAsGraduated);
EnrollmentRouter.post("/:studentId/:enrollmentId/log", middlewares.isAuthenticated, middlewares.requirePermissions(GlobalPermissionCode.ReadStudent), validators.createEnrollmentLog, controllers.createEnrollmentLog);
export default EnrollmentRouter;
//# sourceMappingURL=enrollment.js.map