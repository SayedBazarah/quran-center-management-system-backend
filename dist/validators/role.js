import { globalValidatorMiddleware } from "@/middlewares";
import { body, param } from "express-validator";
const commonValidator = [
    body("name").isString().withMessage("Name must be a string"),
    body("permissions")
        .isArray({ min: 1 })
        .withMessage("Permissions must be an array with at least one element"),
    body("permissions.*")
        .isMongoId()
        .withMessage("Permissions must be a valid MongoDB ID"),
];
export const createRole = [...commonValidator, globalValidatorMiddleware];
export const updateRole = [
    ...commonValidator,
    param("id").isMongoId().withMessage("Id must be a valid MongoDB ID"),
    globalValidatorMiddleware,
];
export const deleteRole = [
    param("id").isMongoId().withMessage("Id must be a valid MongoDB ID"),
    globalValidatorMiddleware,
];
//# sourceMappingURL=role.js.map