import { Router } from "express";
import { lookupParentPortal, getStudentForParentPortal } from "@/controllers";

const ParentPortalRouter = Router();

// POST /api/v1/parent-portal/lookup
// Public - parent authenticates with phone + nationalId
ParentPortalRouter.post("/lookup", lookupParentPortal);

// GET /api/v1/parent-portal/student/:studentId
// Public - used by QR code link to show student progress
ParentPortalRouter.get("/student/:studentId", getStudentForParentPortal);

export default ParentPortalRouter;
