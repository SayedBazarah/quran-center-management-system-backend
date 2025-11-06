import { Types } from "mongoose";
export declare function seedPermissions(): Promise<string[]>;
export declare function seedSuperAdminRole(): Promise<{
    roleId: Types.ObjectId;
}>;
export declare function seedSuperAdminUser(roleId: Types.ObjectId): Promise<void>;
export declare function seedSuperAdmin(): Promise<void>;
//# sourceMappingURL=seedSuperAdmin.d.ts.map