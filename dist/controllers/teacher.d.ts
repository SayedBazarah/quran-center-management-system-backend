import { Request, Response, NextFunction } from "express";
/**
 * Create Teacher
 * Required: name, email, nationalId, username, branchId
 */
export declare const createTeacher: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * List Teachers (pagination, search, optional branch filter)
 */
export declare const listTeachers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Edit Teacher by ID
 * If password provided, use findById -> assign -> save() to trigger hashing
 */
export declare const updateTeacherById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Delete Teacher by ID
 */
export declare const deleteTeacherById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=teacher.d.ts.map