// src/middlewares/upload.ts
import multer, { MulterError } from "multer";
import path from "path";
// 10 MB default
const MAX_FILE_BYTES = Number(process.env.UPLOAD_MAX_BYTES || 10 * 1024 * 1024);
// Allowed mime prefixes and extensions (tighten for your use-case)
const ALLOWED_MIME_PREFIXES = ["image/", "application/pdf"];
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"]);
// Use memoryStorage if you plan to push to S3/GCS; for local disk use diskStorage
const storage = multer.memoryStorage();
function fileFilter(req, file, cb) {
    try {
        const ext = path.extname(file.originalname).toLowerCase();
        const mimeOk = ALLOWED_MIME_PREFIXES.some((p) => file.mimetype.startsWith(p));
        const extOk = ALLOWED_EXT.has(ext);
        if (!mimeOk || !extOk) {
            return cb(new MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
            // Alternatively: cb(new Error('Unsupported file type'))
        }
        cb(null, true);
    }
    catch (e) {
        cb(e);
    }
}
// Single field uploader factory (so you can vary fields per route)
export function uploadSingle(fieldName, fileSizeBytes = MAX_FILE_BYTES) {
    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: fileSizeBytes, // inclusive limit: consider +1 byte if you hit exact-size edge cases
            files: 1,
        },
    }).single(fieldName);
}
// Multiple files for known fields
export function uploadFields(fields, fileSizeBytes = MAX_FILE_BYTES) {
    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: fileSizeBytes,
        },
    }).fields(fields);
}
// Export MulterError type-guard for the error handler
export function isMulterError(err) {
    return (!!err && typeof err === "object" && err.name === "MulterError");
}
//# sourceMappingURL=upload.js.map