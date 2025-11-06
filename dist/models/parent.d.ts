import { Gender, ParentRelationship } from "@/types/enums";
import { IContactInfo, IIdentityDocument, ITimestamps } from "@/types/interfaces";
import mongoose, { Document, Types } from "mongoose";
/**
 * Parent Interface
 */
export interface IParent extends Document, ITimestamps, IContactInfo, IIdentityDocument {
    name: string;
    birthDate?: Date;
    gender?: Gender;
    relationship?: ParentRelationship;
    studentId?: Types.ObjectId;
}
declare const _default: mongoose.Model<IParent, {}, {}, {}, mongoose.Document<unknown, {}, IParent, {}, {}> & IParent & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=parent.d.ts.map