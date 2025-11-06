import { Request, Response, NextFunction } from "express";
/**
 * Create Branch
 */
export declare const createBranch: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * List Branches with pagination, search, and filters
 */
export declare const listBranches: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Update Branch by ID
 */
export declare const updateBranchById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Delete Branch by ID
 * If you plan to soft-delete, replace with an update to isActive/isDeleted.
 */
export declare const deleteBranchById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=branch.d.ts.map