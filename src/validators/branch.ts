import { globalValidatorMiddleware } from "@/middlewares";
import { body, param } from "express-validator";

const commonValidator = [
  body("name").isString().withMessage("Name must be a string"),
  body("address").isString().optional().withMessage("Address must be a string"),
  body("phone").isString().optional().withMessage("Phone must be a string"),
];
export const createBranch = [...commonValidator, globalValidatorMiddleware];

export const updateBranch = [
  ...commonValidator,
  param("id").isMongoId().withMessage("Id must be a valid MongoDB ID"),
  globalValidatorMiddleware,
];

export const deleteBranch = [
  param("id").isMongoId().withMessage("Id must be a valid MongoDB ID"),
  globalValidatorMiddleware,
];
