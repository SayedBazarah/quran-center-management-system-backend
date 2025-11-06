// src/routes/parentRoutes.ts
import { Router } from "express";
import { asyncHandler } from "@utils/asyncHandler";
import {
  createParent,
  updateParentById,
  deleteParentById,
  getParentByStudentId,
  listParents,
} from "@/controllers";

const ParentRouter = Router();

// POST /api/v1/parents
ParentRouter.post("/", asyncHandler(createParent));

// PATCH /api/v1/parents/:id
ParentRouter.patch("/:id", asyncHandler(updateParentById));

// DELETE /api/v1/parents/:id
ParentRouter.delete("/:id", asyncHandler(deleteParentById));

// GET /api/v1/parents/by-student/:studentId
ParentRouter.get("/by-student/:studentId", asyncHandler(getParentByStudentId));

// GET /api/v1/parents
ParentRouter.get("/", asyncHandler(listParents));

export default ParentRouter;
