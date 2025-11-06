"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdmin = exports.updateAdmin = exports.createAdmin = void 0;
const middlewares_1 = require("../middlewares");
const express_validator_1 = require("express-validator");
const commonAttributes = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Email is invalid"),
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
    (0, express_validator_1.body)("username").isString().withMessage("username must be a string"),
    (0, express_validator_1.body)("roleId").isString().withMessage("RoleId must be a string"),
    (0, express_validator_1.body)("branchIds").isArray().optional(),
    (0, express_validator_1.body)("branchIds.*")
        .isMongoId()
        .withMessage("every BranchId must be a mongoId"),
];
exports.createAdmin = [
    ...commonAttributes,
    (0, express_validator_1.body)("password")
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    middlewares_1.globalValidatorMiddleware,
];
exports.updateAdmin = [
    ...commonAttributes,
    (0, express_validator_1.param)("id").isMongoId().withMessage("ID must be a valid MongoDB ID"),
    (0, express_validator_1.body)("password")
        .optional()
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    middlewares_1.globalValidatorMiddleware,
];
exports.deleteAdmin = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("ID must be a valid MongoDB ID"),
    middlewares_1.globalValidatorMiddleware,
];
