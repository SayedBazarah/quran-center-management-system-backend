"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/courseRoutes.ts
const express_1 = require("express");
const course_1 = require("../controllers/course");
const CourseRouter = (0, express_1.Router)();
CourseRouter.post("/", course_1.createCourse);
CourseRouter.get("/", course_1.listCourses);
CourseRouter.patch("/:id", course_1.updateCourseById);
CourseRouter.delete("/:id", course_1.deleteCourseById);
exports.default = CourseRouter;
