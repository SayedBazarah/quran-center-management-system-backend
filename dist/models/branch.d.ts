import mongoose, { Document } from "mongoose";
import { ITimestamps } from "../src/types/interfaces";
/**
 * Branch Interface
 */
export interface IBranch extends Document, ITimestamps {
    name: string;
    address?: string;
    phone?: string;
    isActive: boolean;
}
declare const _default: mongoose.Model<IBranch, {}, {}, {}, mongoose.Document<unknown, {}, IBranch, {}, {}> & IBranch & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=branch.d.ts.map