import { Types } from "mongoose";
/**
 * Base timestamp interface
 */
export interface ITimestamps {
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Soft delete interface
 */
export interface ISoftDelete {
    isDeleted: boolean;
    deletedAt?: Date;
}
/**
 * Audit fields interface
 */
export interface IAuditFields {
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    deletedBy?: Types.ObjectId;
}
/**
 * Contact information interface
 */
export interface IContactInfo {
    email?: string;
    phone?: string;
    address?: string;
}
/**
 * Identity document interface
 */
export interface IIdentityDocument {
    nationalId: string;
    nationalIdImg?: string;
}
/**
 * User credentials interface
 */
export interface IUserCredentials {
    username: string;
    password?: string;
}
/**
 * Pagination result interface
 */
export interface IPaginationResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
/**
 * Query filter interface
 */
export interface IQueryFilter {
    page?: number;
    limit?: number;
    sort?: string;
    fields?: string;
    search?: string;
}
//# sourceMappingURL=interfaces.d.ts.map