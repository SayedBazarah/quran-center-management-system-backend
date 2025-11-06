import { Request, Response, NextFunction } from "express";
/**
 * Create Role
 * - name required
 * - unique by name (handled by unique index; map duplicate key errors globally)
 */
export declare const createRole: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * List Roles with pagination and search
 */
export declare const listRoles: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const listPermissions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Edit Role by ID
 * - Updates name and/or isDefault
 * - If toggling to default, unset previous defaults (policy)
 */
export declare const updateRoleById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Delete Role by ID
 * - Prevent deleting if assigned to any admin (defensive guard, optional)
 * - Prevent deleting if isDefault (policy)
 */
export declare const deleteRoleById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=role.d.ts.map