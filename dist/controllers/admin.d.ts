import { CreateAdminHandler } from "../src/types/handlers/admin.handlers";
import { RequestHandler } from "express";
/**
 * Create Admin
 * - Validates minimal required fields (name, phone, nationalId, username)
 * - Password hashing handled in Admin schema pre-save
 */
export declare const createAdmin: CreateAdminHandler;
/**
 * List Admins
 * - Supports pagination, sorting, search, and filtering by branch/role
 * - Returns meta pagination info
 */
export declare const listAdmins: RequestHandler;
/**
 * Update Admin by ID
 * - Validates ObjectId
 * - Prevents direct overwrite of immutable/sensitive combinations if needed
 */
export declare const updateAdminById: RequestHandler;
/**
 * Delete Admin by ID
 * - Validates ObjectId
 * - Uses deleteOne (can be swapped for soft delete if needed)
 */
export declare const deleteAdminById: RequestHandler;
//# sourceMappingURL=admin.d.ts.map