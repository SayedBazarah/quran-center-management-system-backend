import { Gender, StudentStatus } from "../src/types/enums";
import { IContactInfo, IIdentityDocument, ITimestamps } from "../src/types/interfaces";
import mongoose, { Document, Types } from "mongoose";
/**
 * Student Interface
 */
export interface IStudent extends Document, ITimestamps, IContactInfo, IIdentityDocument {
    name: string;
    avatar?: string;
    birthDate?: Date;
    gender?: Gender;
    status?: StudentStatus;
    fired: boolean;
    firedAt?: Date;
    firedById?: Types.ObjectId;
    graduated?: Date;
    acceptedById?: Types.ObjectId;
    rejectedById?: Types.ObjectId;
    rejectionReason?: string;
    acceptedAt?: Date;
    rejectedAt?: Date;
    branchId?: Types.ObjectId;
    parentId?: Types.ObjectId;
    adminId?: Types.ObjectId;
    createdBy?: Types.ObjectId;
    markAsFired(adminId: Types.ObjectId, reason?: string): Promise<void>;
    markAsGraduated(): Promise<void>;
}
declare const _default: mongoose.Model<IStudent, {}, {}, {}, mongoose.Document<unknown, {}, IStudent, {}, {}> & IStudent & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=student.d.ts.map