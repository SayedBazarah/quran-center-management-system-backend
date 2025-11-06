import { ITimestamps } from "../src/types/interfaces";
import mongoose, { Document } from "mongoose";
/**
 * Course Interface
 */
export interface ICourse extends Document, ITimestamps {
    name: string;
    duration?: number;
    price?: number;
    order?: number;
    description?: string;
    isActive: boolean;
}
declare const _default: mongoose.Model<ICourse, {}, {}, {}, mongoose.Document<unknown, {}, ICourse, {}, {}> & ICourse & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=course.d.ts.map