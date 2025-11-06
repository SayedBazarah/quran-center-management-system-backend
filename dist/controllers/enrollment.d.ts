import { Request, Response, NextFunction } from "express";
/**
 * Create Enrollment
 * Required: courseId, studentId, optional: teacherId, adminId, startDate/endDate
 * Enforces: course, student, and (if provided) teacher/admin must exist
 */
export declare const createEnrollment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Edit Enrollment (by id)
 * Allows updating status, dates, and relations (with validation)
 */
export declare const updateEnrollmentById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Delete Enrollment (by id)
 */
export declare const deleteEnrollmentById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * List all Enrollments for a Student by studentId
 */
export declare const listEnrollmentsByStudent: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * List all pending Enrollments (require admin accept)
 */
export declare const listPendingEnrollments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const listLateEnrollments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Accept Enrollment (status -> active)
 */
export declare const enrollmentStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Reject Enrollment (status -> dropout, set endDate now)
 */
export declare const rejectEnrollment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Close Enrollment as Graduated (status -> end + set student.graduated + status GRADUATED)
 * If you prefer: set status to END and also mark student as graduated
 */
export declare const closeEnrollmentAsGraduated: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createEnrollmentLog: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=enrollment.d.ts.map