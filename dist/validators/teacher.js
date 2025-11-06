"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeacher = exports.updateTeacher = exports.createTeacher = void 0;
const express_validator_1 = require("express-validator");
const middlewares_1 = require("../middlewares");
const commonAttributes = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Email is invalid"),
    (0, express_validator_1.body)("name")
        .isString()
        .withMessage("Name must be a string")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long"),
    (0, express_validator_1.body)("username")
        .isString()
        .withMessage("username must be a string")
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
    (0, express_validator_1.body)("branchId").isMongoId().withMessage("BranchId must be a string"),
];
exports.createTeacher = [...commonAttributes, middlewares_1.globalValidatorMiddleware];
exports.updateTeacher = [
    (0, express_validator_1.param)("id").isString().withMessage("ID must be a string"),
    ...commonAttributes,
    middlewares_1.globalValidatorMiddleware,
];
exports.deleteTeacher = [
    (0, express_validator_1.param)("id").isString().withMessage("ID must be a string"),
    middlewares_1.globalValidatorMiddleware,
];
