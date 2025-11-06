export declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    readonly code?: string | number;
    readonly details?: unknown;
    constructor(message: string, statusCode?: number, options?: {
        code?: string | number;
        details?: unknown;
        cause?: unknown;
        isOperational?: boolean;
    });
}
export declare class NotFoundError extends AppError {
    constructor(message?: string, details?: unknown);
}
export declare class ValidationError extends AppError {
    constructor(message?: string, details?: unknown);
}
export declare class AuthError extends AppError {
    constructor(message?: string, details?: unknown);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string, details?: unknown);
}
export declare class ConflictError extends AppError {
    constructor(message?: string, details?: unknown);
}
//# sourceMappingURL=app-error.d.ts.map