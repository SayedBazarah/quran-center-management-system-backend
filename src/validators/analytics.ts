import { globalValidatorMiddleware } from "@/middlewares";
import { body } from "express-validator";

export const globalAnalytics = [
  body("start").optional().isISO8601({ strict: true }).toDate(),
  body("end").optional().isISO8601({ strict: true }).toDate(),
  globalValidatorMiddleware,
];
