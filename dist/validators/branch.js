"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBranch = exports.updateBranch = exports.createBranch = void 0;
const middlewares_1 = require("../middlewares");
const express_validator_1 = require("express-validator");
const commonValidator = [
    (0, express_validator_1.body)("name").isString().withMessage("Name must be a string"),
    (0, express_validator_1.body)("address").isString().optional().withMessage("Address must be a string"),
    (0, express_validator_1.body)("phone").isString().optional().withMessage("Phone must be a string"),
];
exports.createBranch = [...commonValidator, middlewares_1.globalValidatorMiddleware];
exports.updateBranch = [
    ...commonValidator,
    (0, express_validator_1.param)("id").isMongoId().withMessage("Id must be a valid MongoDB ID"),
    middlewares_1.globalValidatorMiddleware,
];
exports.deleteBranch = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Id must be a valid MongoDB ID"),
    middlewares_1.globalValidatorMiddleware,
];
