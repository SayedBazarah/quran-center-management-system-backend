"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingle = uploadSingle;
exports.uploadFields = uploadFields;
exports.isMulterError = isMulterError;
// src/middlewares/upload.ts
const multer_1 = __importStar(require("multer"));
const path_1 = __importDefault(require("path"));
// 10 MB default
const MAX_FILE_BYTES = Number(process.env.UPLOAD_MAX_BYTES || 10 * 1024 * 1024);
// Allowed mime prefixes and extensions (tighten for your use-case)
const ALLOWED_MIME_PREFIXES = ["image/", "application/pdf"];
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"]);
// Use memoryStorage if you plan to push to S3/GCS; for local disk use diskStorage
const storage = multer_1.default.memoryStorage();
function fileFilter(_req, file, cb) {
    try {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const mimeOk = ALLOWED_MIME_PREFIXES.some((p) => file.mimetype.startsWith(p));
        const extOk = ALLOWED_EXT.has(ext);
        if (!mimeOk || !extOk) {
            return cb(new multer_1.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
            // Alternatively: cb(new Error('Unsupported file type'))
        }
        cb(null, true);
    }
    catch (e) {
        cb(e);
    }
}
// Single field uploader factory (so you can vary fields per route)
function uploadSingle(fieldName, fileSizeBytes = MAX_FILE_BYTES) {
    return (0, multer_1.default)({
        storage,
        fileFilter,
        limits: {
            fileSize: fileSizeBytes, // inclusive limit: consider +1 byte if you hit exact-size edge cases
            files: 1,
        },
    }).single(fieldName);
}
// Multiple files for known fields
function uploadFields(fields, fileSizeBytes = MAX_FILE_BYTES) {
    return (0, multer_1.default)({
        storage,
        fileFilter,
        limits: {
            fileSize: fileSizeBytes,
        },
    }).fields(fields);
}
// Export MulterError type-guard for the error handler
function isMulterError(err) {
    return (!!err && typeof err === "object" && err.name === "MulterError");
}
