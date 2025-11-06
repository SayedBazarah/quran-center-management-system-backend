"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.ForbiddenError = exports.AuthError = exports.ValidationError = exports.NotFoundError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500, options) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational =
            options?.isOperational ?? (statusCode >= 400 && statusCode < 500);
        this.code = options?.code;
        this.details = options?.details;
        if (options?.cause) {
            // Node >= 16 supports cause
            // @ts-ignore
            this.cause = options.cause;
        }
        Error.captureStackTrace?.(this, this.constructor);
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(message = "Resource not found", details) {
        super(message, 404, { details });
    }
}
exports.NotFoundError = NotFoundError;
class ValidationError extends AppError {
    constructor(message = "Validation error", details) {
        super(message, 400, { details, isOperational: true });
    }
}
exports.ValidationError = ValidationError;
class AuthError extends AppError {
    constructor(message = "Unauthorized", details) {
        super(message, 401, { details, isOperational: true });
    }
}
exports.AuthError = AuthError;
class ForbiddenError extends AppError {
    constructor(message = "Forbidden", details) {
        super(message, 403, { details, isOperational: true });
    }
}
exports.ForbiddenError = ForbiddenError;
class ConflictError extends AppError {
    constructor(message = "Conflict", details) {
        super(message, 409, { details, isOperational: true });
    }
}
exports.ConflictError = ConflictError;
