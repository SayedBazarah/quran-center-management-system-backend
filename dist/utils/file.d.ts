export declare enum MediaCategory {
    Admin = "admin",
    Student = "student",
    Teacher = "teacher"
}
export type MulterSingle = Express.Multer.File;
export type MulterMany = Express.Multer.File[];
export declare function ensureDir(dirPath: string): Promise<void>;
export declare function initBaseFolders(): Promise<void>;
export declare function buildPath(...segments: string[]): string;
export declare function ensureUserFolder(category: MediaCategory, userId: string): Promise<string>;
export declare function exists(path: string): Promise<boolean>;
export declare function saveBuffer(filePath: string, buffer: Buffer): Promise<string>;
export declare function saveMulterFile(category: MediaCategory, file: MulterSingle, options?: {
    userId?: string;
    filename?: string;
    subfolder?: string;
}): Promise<{
    path: string;
    filename: string;
}>;
export declare function saveMulterFiles(category: MediaCategory, files: MulterMany, options?: {
    userId?: string;
    subfolder?: string;
}): Promise<string[]>;
export declare function removeFile(filePath: string): Promise<boolean>;
export declare function removeFolder(dirPath: string): Promise<boolean>;
export declare function listFiles(dirPath: string): Promise<string[]>;
//# sourceMappingURL=file.d.ts.map