import { Request, Response, NextFunction } from "express";
/**
 * Create Course
 */
export declare const createCourse: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * List Courses (pagination + filters)
 */
export declare const listCourses: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Update Course by ID
 */
export declare const updateCourseById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Delete Course by ID
 */
export declare const deleteCourseById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=course.d.ts.map