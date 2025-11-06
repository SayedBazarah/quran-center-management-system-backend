import mongoose, { Document, Types } from "mongoose";
export interface IPayment extends Document {
    amount: number;
    handledBy?: string;
    enrollmentId: Types.ObjectId;
    studentId: Types.ObjectId;
    adminId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IPayment, {}, {}, {}, mongoose.Document<unknown, {}, IPayment, {}, {}> & IPayment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=payment.d.ts.map