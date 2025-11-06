import mongoose, { Document, Types } from "mongoose";
/**
 * Permission Interface
 */
export interface IPermission extends Document {
    code: string;
    name: string;
    roleId: Types.ObjectId;
}
declare const _default: mongoose.Model<IPermission, {}, {}, {}, mongoose.Document<unknown, {}, IPermission, {}, {}> & IPermission & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=permission.d.ts.map