// src/routes/courseRoutes.ts
import { Router } from "express";
import { asyncHandler } from "@utils/asyncHandler";
import {
  createCourse,
  listCourses,
  updateCourseById,
  deleteCourseById,
} from "@/controllers/course";

const CourseRouter = Router();

CourseRouter.post("/", asyncHandler(createCourse));
CourseRouter.get("/", asyncHandler(listCourses));
CourseRouter.patch("/:id", asyncHandler(updateCourseById));
CourseRouter.delete("/:id", asyncHandler(deleteCourseById));

export default CourseRouter;
