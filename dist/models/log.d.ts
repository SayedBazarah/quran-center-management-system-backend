import mongoose, { Document, Types } from "mongoose";
export type FieldChange = {
    field: string;
    from?: string | number | boolean | null;
    to?: string | number | boolean | null;
};
export declare enum LogAction {
    CREATE = "create",
    UPDATE = "update",
    STATUS_CHANGE = "status-change",
    DELETE = "delete",
    ENROLL = "enroll",
    UNENROLL = "unenroll",
    SYSTEM = "system"
}
export interface ILog extends Document {
    action?: LogAction;
    note?: string;
    studentId: Types.ObjectId;
    enrollmentId?: Types.ObjectId;
    adminId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    changes?: FieldChange[];
    logs: ILog[];
}
declare const _default: mongoose.Model<ILog, {}, {}, {}, mongoose.Document<unknown, {}, ILog, {}, {}> & ILog & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=log.d.ts.map