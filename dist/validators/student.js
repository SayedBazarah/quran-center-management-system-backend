"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactiveStudent = exports.fireStudent = exports.rejectStudent = exports.updateStudentStatus = exports.studentDetails = exports.deleteStudent = exports.updateStudent = exports.createStudent = void 0;
const middlewares_1 = require("../middlewares");
const enums_1 = require("../types/enums");
const express_validator_1 = require("express-validator");
const commonAttributes = [
    (0, express_validator_1.body)("email").optional().isEmail().withMessage("Email is invalid"),
    (0, express_validator_1.body)("name")
        .isString()
        .withMessage("Name must be a string")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long"),
    (0, express_validator_1.body)("phone")
        .isString()
        .withMessage("Phone number is invalid")
        .isLength({
        min: 10,
        max: 14,
    })
        .withMessage("Phone number must be 10 digits"),
    (0, express_validator_1.body)("nationalId")
        .isString()
        .withMessage("National ID must be a string")
        .isLength({ min: 14, max: 14 })
        .withMessage("National ID must be at 14 characters long"),
    (0, express_validator_1.body)("gender")
        .isString()
        .withMessage("Gender must be a string")
        .isIn(["male", "female"])
        .withMessage("Gender must be male, female, or other"),
    (0, express_validator_1.body)("branchId").isString().withMessage("BranchId must be a string"),
    (0, express_validator_1.body)("adminId").isString().withMessage("adminId must be a string"),
    (0, express_validator_1.body)("birthDate").isString().withMessage("BithDate must be a string"),
    (0, express_validator_1.body)("address").isString().withMessage("Address must be a string"),
];
exports.createStudent = [...commonAttributes, middlewares_1.globalValidatorMiddleware];
exports.updateStudent = [
    (0, express_validator_1.param)("id").isMongoId(),
    ...commonAttributes,
    middlewares_1.globalValidatorMiddleware,
];
exports.deleteStudent = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("ID must be a valid MongoDB ID"),
    middlewares_1.globalValidatorMiddleware,
];
exports.studentDetails = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("ID must be a valid MongoDB ID"),
    middlewares_1.globalValidatorMiddleware,
];
exports.updateStudentStatus = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("ID must be a valid MongoDB ID"),
    (0, express_validator_1.body)("status")
        .isIn((0, enums_1.getEnumValues)(enums_1.StudentStatus))
        .withMessage("Invalid status"),
    (0, express_validator_1.body)("reason").optional().isString().withMessage("Reason must be a string"),
    middlewares_1.globalValidatorMiddleware,
];
exports.rejectStudent = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("ID must be a valid MongoDB ID"),
    middlewares_1.globalValidatorMiddleware,
];
exports.fireStudent = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("ID must be a valid MongoDB ID"),
    middlewares_1.globalValidatorMiddleware,
];
exports.reactiveStudent = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("ID must be a valid MongoDB ID"),
    middlewares_1.globalValidatorMiddleware,
];
