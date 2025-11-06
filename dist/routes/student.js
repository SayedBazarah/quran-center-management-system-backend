"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/studentRoutes.ts
const express_1 = require("express");
const controllers = __importStar(require("../controllers"));
const validators = __importStar(require("../validators"));
const middlewares = __importStar(require("../middlewares"));
const permissionSeeds_1 = require("../bootstrap/permissionSeeds");
const StudentRouter = (0, express_1.Router)();
// CRUD
StudentRouter.post("/", middlewares.isAuthenticated, middlewares.requirePermissions(permissionSeeds_1.GlobalPermissionCode.CreateStudent), middlewares.uploadSingle("nationalIdImg"), validators.createStudent, controllers.createStudent);
// List with enrollment info
StudentRouter.get("/", middlewares.isAuthenticated, middlewares.requirePermissions(permissionSeeds_1.GlobalPermissionCode.ReadStudent), controllers.listStudentsWithEnrollment);
StudentRouter.patch("/:id", middlewares.isAuthenticated, middlewares.requirePermissions(permissionSeeds_1.GlobalPermissionCode.UpdateStudent), middlewares.uploadSingle("nationalIdImg"), validators.updateStudent, controllers.updateStudentById);
StudentRouter.delete("/:id", middlewares.isAuthenticated, middlewares.requirePermissions(permissionSeeds_1.GlobalPermissionCode.DeleteStudent), validators.deleteStudent, controllers.deleteStudentById);
// Details
StudentRouter.get("/:id", middlewares.isAuthenticated, middlewares.requirePermissions(permissionSeeds_1.GlobalPermissionCode.ReadStudent), validators.studentDetails, controllers.getStudentDetails);
// Pending students
StudentRouter.get("/status/pending/list", middlewares.isAuthenticated, middlewares.requirePermissions(permissionSeeds_1.GlobalPermissionCode.AcceptStudent), controllers.listPendingStudents);
// Actions
StudentRouter.post("/:id/status", middlewares.isAuthenticated, middlewares.requirePermissions(permissionSeeds_1.GlobalPermissionCode.AcceptEnrollment), validators.updateStudentStatus, controllers.updateStudentStatus);
StudentRouter.post("/:id/fire", middlewares.isAuthenticated, middlewares.requirePermissions(permissionSeeds_1.GlobalPermissionCode.AcceptEnrollment), validators.updateStudentStatus, controllers.updateStudentStatus);
StudentRouter.delete("/:id", middlewares.isAuthenticated, middlewares.requirePermissions(permissionSeeds_1.GlobalPermissionCode.DeleteStudent), validators.deleteStudent, controllers.deleteStudentById);
// Details
StudentRouter.get("/:id", middlewares.isAuthenticated, middlewares.requirePermissions(permissionSeeds_1.GlobalPermissionCode.ReadStudent), validators.studentDetails, controllers.getStudentDetails);
exports.default = StudentRouter;
