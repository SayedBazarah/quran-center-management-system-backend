import mongoose, { Document, Types } from "mongoose";
/**
 * Role Interface
 */
export interface IRole extends Document {
    name: string;
    isDefault: boolean;
    permissions: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IRole, {}, {}, {}, mongoose.Document<unknown, {}, IRole, {}, {}> & IRole & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=role.d.ts.map