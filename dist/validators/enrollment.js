import { globalValidatorMiddleware } from "@/middlewares";
import { EnrollmentStatus } from "@/types/enums";
import { body, param } from "express-validator";
export const createEnrollment = [
    param("studentId")
        .isMongoId()
        .withMessage("StudentId must be a valid MongoDB ID"),
    body("startDate").optional().isISO8601({ strict: true }).toDate(),
    body("courseId")
        .isMongoId()
        .withMessage("CourseId must be a valid MongoDB ID"),
    body("teacherId")
        .isMongoId()
        .withMessage("TeacherId must be a valid MongoDB ID"),
    body("adminId").isMongoId().withMessage("AdminId must be a valid MongoDB ID"),
    globalValidatorMiddleware,
];
export const updateEnrollment = [
    param("id").isMongoId().withMessage("Id must be a valid MongoDB ID"),
    body("status")
        .isIn([
        EnrollmentStatus.ACTIVE,
        EnrollmentStatus.GRADUATED,
        EnrollmentStatus.DROPOUT,
        EnrollmentStatus.REJECTED,
        EnrollmentStatus.LATE,
        EnrollmentStatus.PENDING,
    ])
        .withMessage("Invalid status"),
    body("teacherId")
        .isMongoId()
        .withMessage("TeacherId must be a valid MongoDB ID"),
    body("adminId").isMongoId().withMessage("AdminId must be a valid MongoDB ID"),
    globalValidatorMiddleware,
];
export const deleteEnrollment = [
    body("id").isMongoId().withMessage("Id must be a valid MongoDB ID"),
    globalValidatorMiddleware,
];
export const acceptEnrollment = [
    param("enrollmentId")
        .isMongoId()
        .withMessage("Id must be a valid MongoDB ID"),
    body("status").isString().withMessage("Reason must be a string"),
    body("reason").optional().isString().withMessage("Reason must be a string"),
    globalValidatorMiddleware,
];
export const createEnrollmentLog = [
    param("studentId")
        .isMongoId()
        .withMessage("StudentId must be a valid MongoDB ID"),
    param("enrollmentId")
        .isMongoId()
        .withMessage("enrollmentId must be a valid MongoDB ID"),
    body("note").isString().withMessage("note must be a string"),
    globalValidatorMiddleware,
];
//# sourceMappingURL=enrollment.js.map