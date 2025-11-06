/**
 * Centralized Enums for QMS
 * Enhanced with validation helpers
 */
export var EnrollmentStatus;
(function (EnrollmentStatus) {
    EnrollmentStatus["PENDING"] = "pending";
    EnrollmentStatus["ACTIVE"] = "active";
    EnrollmentStatus["LATE"] = "late";
    EnrollmentStatus["DROPOUT"] = "dropout";
    EnrollmentStatus["GRADUATED"] = "graduated";
    EnrollmentStatus["REJECTED"] = "rejected";
})(EnrollmentStatus || (EnrollmentStatus = {}));
export var StudentStatus;
(function (StudentStatus) {
    StudentStatus["ACTIVE"] = "active";
    StudentStatus["PENDING"] = "pending";
    StudentStatus["LATE"] = "late";
    StudentStatus["DROPOUT"] = "dropout";
    StudentStatus["GRADUATED"] = "graduated";
    StudentStatus["REJECTED"] = "rejected";
})(StudentStatus || (StudentStatus = {}));
export var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
})(Gender || (Gender = {}));
export var ParentRelationship;
(function (ParentRelationship) {
    ParentRelationship["FATHER"] = "father";
    ParentRelationship["MOTHER"] = "mother";
    ParentRelationship["GUARDIAN"] = "guardian";
    ParentRelationship["UNCLE"] = "uncle";
    ParentRelationship["AUNT"] = "aunt";
    ParentRelationship["GRANDFATHER"] = "grandfather";
    ParentRelationship["GRANDMOTHER"] = "grandmother";
})(ParentRelationship || (ParentRelationship = {}));
// Helper to get all enum values as array
export const getEnumValues = (enumObj) => {
    return Object.values(enumObj);
};
//# sourceMappingURL=enums.js.map