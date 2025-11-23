import { globalValidatorMiddleware } from "@/middlewares";
import { body, param } from "express-validator";

const commonAttributes = [
  body("email").isEmail().withMessage("Email is invalid"),
  body("name")
    .isString()
    .withMessage("Name must be a string")
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
  body("username").isString().withMessage("username must be a string"),
  body("roleId").isString().withMessage("RoleId must be a string"),
  body("branchIds").isArray().optional(),
  body("branchIds.*")
    .isMongoId()
    .withMessage("every BranchId must be a mongoId"),
];

export const createAdmin = [
  ...commonAttributes,
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  globalValidatorMiddleware,
];

export const updateAdmin = [
  ...commonAttributes,
  param("id").isMongoId().withMessage("ID must be a valid MongoDB ID"),
body("password")
  .optional({ nullable: true, checkFalsy: true }) // skip if not provided or empty
  .isString()
  .withMessage("Password must be a string")
  .isLength({ min: 8 }) // only validates if password exists
  .withMessage("Password must be at least 8 characters long"),
  globalValidatorMiddleware,
];

export const deleteAdmin = [
  param("id").isMongoId().withMessage("ID must be a valid MongoDB ID"),
  globalValidatorMiddleware,
];
