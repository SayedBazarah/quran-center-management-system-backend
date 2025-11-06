// src/routes/parentRoutes.ts
import { Router } from "express";
import {
  createParent,
  updateParentById,
  deleteParentById,
  getParentByStudentId,
  listParents,
} from "@/controllers";

const ParentRouter = Router();

// POST /api/v1/parents
ParentRouter.post("/", createParent);

// PATCH /api/v1/parents/:id
ParentRouter.patch("/:id", updateParentById);

// DELETE /api/v1/parents/:id
ParentRouter.delete("/:id", deleteParentById);

// GET /api/v1/parents/by-student/:studentId
ParentRouter.get("/by-student/:studentId", getParentByStudentId);

// GET /api/v1/parents
ParentRouter.get("/", listParents);

export default ParentRouter;
