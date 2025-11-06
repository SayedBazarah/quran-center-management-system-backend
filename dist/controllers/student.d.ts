import { Request, Response, NextFunction } from "express";
/**
 * Create Student
 * Required: name, phone, nationalId
 */
export declare const createStudent: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Edit Student by ID
 */
export declare const updateStudentById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Delete Student by ID
 */
export declare const deleteStudentById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Student details by ID
 * Includes aggregated current enrollments count (optional), you can expand as needed
 */
export declare const getStudentDetails: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * List students with enrollment summary:
 * Return students plus latest enrollment for each student (startDate, endDate, course name)
 * You can also add a query param latest=true to restrict to latest enrollment only.
 */
export declare const listStudents: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const listStudentsWithEnrollment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * List all pending students (waiting to be accepted)
 */
export declare const listPendingStudents: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Accept student (status -> active; set acceptedById)
 */
export declare const acceptStudent: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Reject student (status -> dropout)
 */
export declare const updateStudentStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Fire student (sets fired=true, firedAt=now, firedById) and marks status DROPOUT via model hook
 */
export declare const fireStudent: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Re-join fired student (suggested name: reActivateFiredStudent)
 * Sets fired=false, clears firedAt/firedById, sets status ACTIVE
 */
export declare const reActivateFiredStudent: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=student.d.ts.map