import { Router } from "express";

import AuthRoute from "./auth";
import AdminRouter from "./admin";
import AnalyticsRouter from "./analytics";
import BranchRouter from "./branch";
import CourseRouter from "./course";
import RoleRouter from "./role";
import EnrollmentRouter from "./enrollment";
import ParentRouter from "./parent";
import StudentRouter from "./student";
import TeacherRouter from "./teacher";

const routes = Router();

routes.use("/auth", AuthRoute);
routes.use("/admins", AdminRouter);
routes.use("/analytics", AnalyticsRouter);
routes.use("/branches", BranchRouter);
routes.use("/courses", CourseRouter);
routes.use("/roles", RoleRouter);
routes.use("/enrollments", EnrollmentRouter);
routes.use("/parents", ParentRouter);
routes.use("/students", StudentRouter);
routes.use("/teachers", TeacherRouter);

// Health check
routes.get("/check-health", (req, res) => {
  res.json({ message: "OK " });
});

export default routes;
