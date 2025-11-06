export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string | number;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    options?: {
      code?: string | number;
      details?: unknown;
      cause?: unknown;
      isOperational?: boolean;
    }
  ) {
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

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", details?: unknown) {
    super(message, 404, { details });
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation error", details?: unknown) {
    super(message, 400, { details, isOperational: true });
  }
}

export class AuthError extends AppError {
  constructor(message = "Unauthorized", details?: unknown) {
    super(message, 401, { details, isOperational: true });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details?: unknown) {
    super(message, 403, { details, isOperational: true });
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", details?: unknown) {
    super(message, 409, { details, isOperational: true });
  }
}
