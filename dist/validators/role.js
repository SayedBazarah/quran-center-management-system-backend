"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRole = exports.updateRole = exports.createRole = void 0;
const middlewares_1 = require("../middlewares");
const express_validator_1 = require("express-validator");
const commonValidator = [
    (0, express_validator_1.body)("name").isString().withMessage("Name must be a string"),
    (0, express_validator_1.body)("permissions")
        .isArray({ min: 1 })
        .withMessage("Permissions must be an array with at least one element"),
    (0, express_validator_1.body)("permissions.*")
        .isMongoId()
        .withMessage("Permissions must be a valid MongoDB ID"),
];
exports.createRole = [...commonValidator, middlewares_1.globalValidatorMiddleware];
exports.updateRole = [
    ...commonValidator,
    (0, express_validator_1.param)("id").isMongoId().withMessage("Id must be a valid MongoDB ID"),
    middlewares_1.globalValidatorMiddleware,
];
exports.deleteRole = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Id must be a valid MongoDB ID"),
    middlewares_1.globalValidatorMiddleware,
];
