"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const multer_1 = __importDefault(require("multer")); // add at top
const mongoose_1 = __importDefault(require("mongoose"));
const errors_1 = require("../errors");
const mapToAppError = (err) => {
    if (err instanceof errors_1.AppError)
        return err;
    if (typeof err === "object" && err !== null && err.code === 11000) {
        const e = err;
        const fields = e.keyValue
            ? Object.keys(e.keyValue).join(", ")
            : "unique field";
        return new errors_1.ConflictError(`Duplicate value for ${fields}`, {
            keyValue: e.keyValue,
        });
    }
    if (err instanceof mongoose_1.default.Error.CastError) {
        return new errors_1.ValidationError(`Invalid ${err.path}: ${err.value}`, {
            path: err.path,
            value: err.value,
        });
    }
    if (err instanceof mongoose_1.default.Error.ValidationError) {
        const details = Object.values(err.errors).map((e) => ({
            path: e.path,
            message: e.message,
        }));
        return new errors_1.ValidationError("Validation failed", details);
    }
    if (err instanceof multer_1.default.MulterError) {
        // Common MulterError codes: LIMIT_PART_COUNT, LIMIT_FILE_SIZE, LIMIT_FILE_COUNT, LIMIT_FIELD_KEY
        const code = err.code;
        const status = code === "LIMIT_FILE_SIZE" ? 413 : 400;
        const message = code === "LIMIT_FILE_SIZE"
            ? "File too large"
            : code === "LIMIT_UNEXPECTED_FILE"
                ? "Unsupported file type or unexpected field"
                : "Upload error";
        return new errors_1.ValidationError(message, {
            status,
            code,
            field: err.field,
        });
    }
    if (typeof err === "object" &&
        err !== null &&
        Array.isArray(err.errors)) {
        return new errors_1.ValidationError("Validation failed", err.errors);
    }
    if (typeof err === "object" && err !== null && err.status === 401) {
        return new errors_1.AppError(err.message || "Unauthorized", 401, {
            isOperational: true,
        });
    }
    const anyErr = err;
    return new errors_1.AppError(anyErr?.message || "Internal Server Error", 500, {
        isOperational: false,
    });
};
const errorHandler = (err, req, res, _next) => {
    const env = process.env.NODE_ENV || "development";
    const appErr = mapToAppError(err);
    if (env === "production") {
        // eslint-disable-next-line no-console
        console.error(`[err] ${appErr.statusCode} ${appErr.message}`, {
            path: req.originalUrl,
            method: req.method,
            code: err?.code,
            details: appErr?.details,
        });
    }
    else {
        // eslint-disable-next-line no-console
        console.error("[err]", err);
    }
    const base = {
        success: false,
        message: appErr.message,
        code: appErr.code,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method,
    };
    if (env !== "production") {
        res.status(appErr.statusCode).json({
            ...base,
            details: appErr.details,
            stack: appErr.stack,
        });
        return;
    }
    const payload = { ...base };
    if (appErr.statusCode >= 400 && appErr.statusCode < 500 && appErr.details) {
        payload.details = appErr.details;
    }
    res.status(appErr.statusCode).json(payload);
    return;
};
exports.errorHandler = errorHandler;
