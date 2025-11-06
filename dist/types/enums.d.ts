/**
 * Centralized Enums for QMS
 * Enhanced with validation helpers
 */
export declare enum EnrollmentStatus {
    PENDING = "pending",
    ACTIVE = "active",
    LATE = "late",
    DROPOUT = "dropout",
    GRADUATED = "graduated",
    REJECTED = "rejected"
}
export declare enum StudentStatus {
    ACTIVE = "active",
    PENDING = "pending",
    LATE = "late",
    DROPOUT = "dropout",
    GRADUATED = "graduated",
    REJECTED = "rejected"
}
export declare enum Gender {
    MALE = "male",
    FEMALE = "female"
}
export declare enum ParentRelationship {
    FATHER = "father",
    MOTHER = "mother",
    GUARDIAN = "guardian",
    UNCLE = "uncle",
    AUNT = "aunt",
    GRANDFATHER = "grandfather",
    GRANDMOTHER = "grandmother"
}
export declare const getEnumValues: <T extends Record<string, string>>(enumObj: T) => string[];
//# sourceMappingURL=enums.d.ts.map