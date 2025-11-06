import mongoose, { Document, Types } from "mongoose";
import { Gender } from "../src/types/enums";
import { IContactInfo, IIdentityDocument, ITimestamps, IUserCredentials } from "../src/types/interfaces";
/**
 * Teacher Interface
 */
export interface ITeacher extends Document, ITimestamps, IContactInfo, IIdentityDocument, IUserCredentials {
    name: string;
    avatar?: string;
    gender?: Gender;
    branchId: Types.ObjectId;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const _default: mongoose.Model<ITeacher, {}, {}, {}, mongoose.Document<unknown, {}, ITeacher, {}, {}> & ITeacher & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=teacher.d.ts.map