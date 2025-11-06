"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnrollmentLog = exports.acceptEnrollment = exports.deleteEnrollment = exports.updateEnrollment = exports.createEnrollment = void 0;
const middlewares_1 = require("../middlewares");
const enums_1 = require("../types/enums");
const express_validator_1 = require("express-validator");
exports.createEnrollment = [
    (0, express_validator_1.param)("studentId")
        .isMongoId()
        .withMessage("StudentId must be a valid MongoDB ID"),
    (0, express_validator_1.body)("startDate").optional().isISO8601({ strict: true }).toDate(),
    (0, express_validator_1.body)("courseId")
        .isMongoId()
        .withMessage("CourseId must be a valid MongoDB ID"),
    (0, express_validator_1.body)("teacherId")
        .isMongoId()
        .withMessage("TeacherId must be a valid MongoDB ID"),
    (0, express_validator_1.body)("adminId").isMongoId().withMessage("AdminId must be a valid MongoDB ID"),
    middlewares_1.globalValidatorMiddleware,
];
exports.updateEnrollment = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Id must be a valid MongoDB ID"),
    (0, express_validator_1.body)("status")
        .isIn([
        enums_1.EnrollmentStatus.ACTIVE,
        enums_1.EnrollmentStatus.GRADUATED,
        enums_1.EnrollmentStatus.DROPOUT,
        enums_1.EnrollmentStatus.REJECTED,
        enums_1.EnrollmentStatus.LATE,
        enums_1.EnrollmentStatus.PENDING,
    ])
        .withMessage("Invalid status"),
    (0, express_validator_1.body)("teacherId")
        .isMongoId()
        .withMessage("TeacherId must be a valid MongoDB ID"),
    (0, express_validator_1.body)("adminId").isMongoId().withMessage("AdminId must be a valid MongoDB ID"),
    middlewares_1.globalValidatorMiddleware,
];
exports.deleteEnrollment = [
    (0, express_validator_1.body)("id").isMongoId().withMessage("Id must be a valid MongoDB ID"),
    middlewares_1.globalValidatorMiddleware,
];
exports.acceptEnrollment = [
    (0, express_validator_1.param)("enrollmentId")
        .isMongoId()
        .withMessage("Id must be a valid MongoDB ID"),
    (0, express_validator_1.body)("status").isString().withMessage("Reason must be a string"),
    (0, express_validator_1.body)("reason").optional().isString().withMessage("Reason must be a string"),
    middlewares_1.globalValidatorMiddleware,
];
exports.createEnrollmentLog = [
    (0, express_validator_1.param)("studentId")
        .isMongoId()
        .withMessage("StudentId must be a valid MongoDB ID"),
    (0, express_validator_1.param)("enrollmentId")
        .isMongoId()
        .withMessage("enrollmentId must be a valid MongoDB ID"),
    (0, express_validator_1.body)("note").isString().withMessage("note must be a string"),
    middlewares_1.globalValidatorMiddleware,
];
