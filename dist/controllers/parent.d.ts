import { Request, Response, NextFunction } from "express";
/**
 * Create Parent
 * Requires studentId to link to an existing Student (1:1 relation in your model)
 */
export declare const createParent: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Edit Parent (by parent id)
 */
export declare const updateParentById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Delete Parent (by parent id)
 */
export declare const deleteParentById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Details by studentId (NOT by parentId)
 */
export declare const getParentByStudentId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * List Parents (pagination + search)
 */
export declare const listParents: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=parent.d.ts.map