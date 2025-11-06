// src/routes/studentRoutes.ts
import { Router } from "express";
import * as controllers from "@/controllers";
import * as validators from "@/validators";
import * as middlewares from "@/middlewares";
import { GlobalPermissionCode } from "@/bootstrap/permissionSeeds";
const StudentRouter = Router();
// CRUD
StudentRouter.post("/", middlewares.isAuthenticated, middlewares.requirePermissions(GlobalPermissionCode.CreateStudent), middlewares.uploadSingle("nationalIdImg"), validators.createStudent, controllers.createStudent);
// List with enrollment info
StudentRouter.get("/", middlewares.isAuthenticated, middlewares.requirePermissions(GlobalPermissionCode.ReadStudent), controllers.listStudentsWithEnrollment);
StudentRouter.patch("/:id", middlewares.isAuthenticated, middlewares.requirePermissions(GlobalPermissionCode.UpdateStudent), middlewares.uploadSingle("nationalIdImg"), validators.updateStudent, controllers.updateStudentById);
StudentRouter.delete("/:id", middlewares.isAuthenticated, middlewares.requirePermissions(GlobalPermissionCode.DeleteStudent), validators.deleteStudent, controllers.deleteStudentById);
// Details
StudentRouter.get("/:id", middlewares.isAuthenticated, middlewares.requirePermissions(GlobalPermissionCode.ReadStudent), validators.studentDetails, controllers.getStudentDetails);
// Pending students
StudentRouter.get("/status/pending/list", middlewares.isAuthenticated, middlewares.requirePermissions(GlobalPermissionCode.AcceptStudent), controllers.listPendingStudents);
// Actions
StudentRouter.post("/:id/status", middlewares.isAuthenticated, middlewares.requirePermissions(GlobalPermissionCode.AcceptEnrollment), validators.updateStudentStatus, controllers.updateStudentStatus);
StudentRouter.post("/:id/fire", middlewares.isAuthenticated, middlewares.requirePermissions(GlobalPermissionCode.AcceptEnrollment), validators.updateStudentStatus, controllers.updateStudentStatus);
StudentRouter.delete("/:id", middlewares.isAuthenticated, middlewares.requirePermissions(GlobalPermissionCode.DeleteStudent), validators.deleteStudent, controllers.deleteStudentById);
// Details
StudentRouter.get("/:id", middlewares.isAuthenticated, middlewares.requirePermissions(GlobalPermissionCode.ReadStudent), validators.studentDetails, controllers.getStudentDetails);
export default StudentRouter;
//# sourceMappingURL=student.js.map