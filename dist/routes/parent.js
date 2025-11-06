"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/parentRoutes.ts
const express_1 = require("express");
const controllers_1 = require("../controllers");
const ParentRouter = (0, express_1.Router)();
// POST /api/v1/parents
ParentRouter.post("/", controllers_1.createParent);
// PATCH /api/v1/parents/:id
ParentRouter.patch("/:id", controllers_1.updateParentById);
// DELETE /api/v1/parents/:id
ParentRouter.delete("/:id", controllers_1.deleteParentById);
// GET /api/v1/parents/by-student/:studentId
ParentRouter.get("/by-student/:studentId", controllers_1.getParentByStudentId);
// GET /api/v1/parents
ParentRouter.get("/", controllers_1.listParents);
exports.default = ParentRouter;
