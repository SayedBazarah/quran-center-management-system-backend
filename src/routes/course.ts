// src/routes/courseRoutes.ts
import { Router } from "express";
import {
  createCourse,
  listCourses,
  updateCourseById,
  deleteCourseById,
} from "@/controllers/course";

const CourseRouter = Router();

CourseRouter.post("/", createCourse);
CourseRouter.get("/", listCourses);
CourseRouter.patch("/:id", updateCourseById);
CourseRouter.delete("/:id", deleteCourseById);

export default CourseRouter;
