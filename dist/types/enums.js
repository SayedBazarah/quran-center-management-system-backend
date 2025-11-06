"use strict";
/**
 * Centralized Enums for QMS
 * Enhanced with validation helpers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnumValues = exports.ParentRelationship = exports.Gender = exports.StudentStatus = exports.EnrollmentStatus = void 0;
var EnrollmentStatus;
(function (EnrollmentStatus) {
    EnrollmentStatus["PENDING"] = "pending";
    EnrollmentStatus["ACTIVE"] = "active";
    EnrollmentStatus["LATE"] = "late";
    EnrollmentStatus["DROPOUT"] = "dropout";
    EnrollmentStatus["GRADUATED"] = "graduated";
    EnrollmentStatus["REJECTED"] = "rejected";
})(EnrollmentStatus || (exports.EnrollmentStatus = EnrollmentStatus = {}));
var StudentStatus;
(function (StudentStatus) {
    StudentStatus["ACTIVE"] = "active";
    StudentStatus["PENDING"] = "pending";
    StudentStatus["LATE"] = "late";
    StudentStatus["DROPOUT"] = "dropout";
    StudentStatus["GRADUATED"] = "graduated";
    StudentStatus["REJECTED"] = "rejected";
})(StudentStatus || (exports.StudentStatus = StudentStatus = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
})(Gender || (exports.Gender = Gender = {}));
var ParentRelationship;
(function (ParentRelationship) {
    ParentRelationship["FATHER"] = "father";
    ParentRelationship["MOTHER"] = "mother";
    ParentRelationship["GUARDIAN"] = "guardian";
    ParentRelationship["UNCLE"] = "uncle";
    ParentRelationship["AUNT"] = "aunt";
    ParentRelationship["GRANDFATHER"] = "grandfather";
    ParentRelationship["GRANDMOTHER"] = "grandmother";
})(ParentRelationship || (exports.ParentRelationship = ParentRelationship = {}));
// Helper to get all enum values as array
const getEnumValues = (enumObj) => {
    return Object.values(enumObj);
};
exports.getEnumValues = getEnumValues;
