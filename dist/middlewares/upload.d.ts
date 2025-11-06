import { MulterError } from "multer";
export declare function uploadSingle(fieldName: string, fileSizeBytes?: number): import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare function uploadFields(fields: Array<{
    name: string;
    maxCount?: number;
}>, fileSizeBytes?: number): import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare function isMulterError(err: unknown): err is MulterError;
//# sourceMappingURL=upload.d.ts.map