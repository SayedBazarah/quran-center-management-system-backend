import { body, param } from "express-validator";
import { globalValidatorMiddleware } from "@/middlewares";

const commonAttributes = [
  body("email").isEmail().withMessage("Email is invalid"),
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("username")
    .isString()
    .withMessage("username must be a string")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("phone")
    .isString()
    .withMessage("Phone number is invalid")
    .isLength({
      min: 10,
      max: 14,
    })
    .withMessage("Phone number must be 10 digits"),
  body("nationalId")
    .isString()
    .withMessage("National ID must be a string")
    .isLength({ min: 14, max: 14 })
    .withMessage("National ID must be at 14 characters long"),
  body("gender")
    .isString()
    .withMessage("Gender must be a string")
    .isIn(["male", "female"])
    .withMessage("Gender must be male, female, or other"),
  body("branchId").isMongoId().withMessage("BranchId must be a string"),
];

export const createTeacher = [...commonAttributes, globalValidatorMiddleware];

export const updateTeacher = [
  param("id").isString().withMessage("ID must be a string"),
  ...commonAttributes,
  globalValidatorMiddleware,
];

export const deleteTeacher = [
  param("id").isString().withMessage("ID must be a string"),
  globalValidatorMiddleware,
];
