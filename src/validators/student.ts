import { globalValidatorMiddleware } from "@/middlewares";
import { getEnumValues, StudentStatus } from "@/types/enums";
import { body, param } from "express-validator";

const commonAttributes = [
  body("email").optional().isEmail().withMessage("Email is invalid"),
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
  body("branchId").isString().withMessage("BranchId must be a string"),
  body("adminId").isString().withMessage("adminId must be a string"),
  body("birthDate").isString().withMessage("BithDate must be a string"),
  body("address").isString().withMessage("Address must be a string"),
];

export const createStudent = [...commonAttributes, globalValidatorMiddleware];
export const updateStudent = [
  param("id").isMongoId(),
  ...commonAttributes,
  globalValidatorMiddleware,
];
export const deleteStudent = [
  param("id").isMongoId().withMessage("ID must be a valid MongoDB ID"),
  globalValidatorMiddleware,
];
export const studentDetails = [
  param("id").isMongoId().withMessage("ID must be a valid MongoDB ID"),
  globalValidatorMiddleware,
];
export const updateStudentStatus = [
  param("id").isMongoId().withMessage("ID must be a valid MongoDB ID"),
  body("status")
    .isIn(getEnumValues(StudentStatus))
    .withMessage("Invalid status"),
  body("reason").optional().isString().withMessage("Reason must be a string"),
  globalValidatorMiddleware,
];
export const rejectStudent = [
  param("id").isMongoId().withMessage("ID must be a valid MongoDB ID"),
  globalValidatorMiddleware,
];
export const fireStudent = [
  param("id").isMongoId().withMessage("ID must be a valid MongoDB ID"),
  globalValidatorMiddleware,
];
export const reactiveStudent = [
  param("id").isMongoId().withMessage("ID must be a valid MongoDB ID"),
  globalValidatorMiddleware,
];
