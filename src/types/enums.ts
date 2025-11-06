/**
 * Centralized Enums for QMS
 * Enhanced with validation helpers
 */

export enum EnrollmentStatus {
  PENDING = "pending",
  ACTIVE = "active",
  LATE = "late",
  DROPOUT = "dropout",
  GRADUATED = "graduated",
  REJECTED = "rejected",
}

export enum StudentStatus {
  ACTIVE = "active",
  PENDING = "pending",
  LATE = "late",
  DROPOUT = "dropout",
  GRADUATED = "graduated",
  REJECTED = "rejected",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

export enum ParentRelationship {
  FATHER = "father",
  MOTHER = "mother",
  GUARDIAN = "guardian",
  UNCLE = "uncle",
  AUNT = "aunt",
  GRANDFATHER = "grandfather",
  GRANDMOTHER = "grandmother",
}

// Helper to get all enum values as array
export const getEnumValues = <T extends Record<string, string>>(
  enumObj: T
): string[] => {
  return Object.values(enumObj);
};
