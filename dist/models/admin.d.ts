import mongoose, { Document, Types } from "mongoose";
import { Gender } from "@/types/enums";
import { IContactInfo, IIdentityDocument, ITimestamps, IUserCredentials } from "@/types/interfaces";
/**
 * Admin Interface
 */
export interface IAdmin extends Document, ITimestamps, IContactInfo, IIdentityDocument, IUserCredentials {
    name: string;
    avatar?: string;
    gender?: Gender;
    roleId?: Types.ObjectId;
    branchIds?: Types.ObjectId[];
    comparePassword(candidatePassword: string): Promise<boolean>;
    hasPermission(permissionCode: string): Promise<boolean>;
}
declare const _default: mongoose.Model<IAdmin, {}, {}, {}, mongoose.Document<unknown, {}, IAdmin, {}, {}> & IAdmin & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=admin.d.ts.map