import { EnrollmentStatus } from "../src/types/enums";
import { ITimestamps } from "../src/types/interfaces";
import mongoose, { Document, Types } from "mongoose";
export interface IEnrollment extends Document, ITimestamps {
    status: EnrollmentStatus;
    startDate: Date;
    endDate?: Date;
    courseId: Types.ObjectId;
    studentId: Types.ObjectId;
    teacherId?: Types.ObjectId;
    adminId?: Types.ObjectId;
    createdBy?: Types.ObjectId;
    rejectionReason?: string;
    rejectedBy?: Types.ObjectId;
    rejectedAt?: Date;
    acceptedBy?: Types.ObjectId;
    acceptedAt?: Date;
    isActiveNow(): boolean;
    close(status?: EnrollmentStatus): Promise<void>;
}
declare const _default: mongoose.Model<IEnrollment, {}, {}, {}, mongoose.Document<unknown, {}, IEnrollment, {}, {}> & IEnrollment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=enrollment.d.ts.map