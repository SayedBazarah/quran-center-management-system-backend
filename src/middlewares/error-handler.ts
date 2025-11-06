// src/middlewares/errorHandler.ts
import type { ErrorRequestHandler } from "express";
import multer from "multer"; // add at top
import mongoose from "mongoose";
import { AppError, ValidationError, ConflictError } from "@/errors";

const mapToAppError = (err: unknown): AppError => {
  if (err instanceof AppError) return err;
  if (typeof err === "object" && err !== null && (err as any).code === 11000) {
    const e = err as any;
    const fields = e.keyValue
      ? Object.keys(e.keyValue).join(", ")
      : "unique field";
    return new ConflictError(`Duplicate value for ${fields}`, {
      keyValue: e.keyValue,
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return new ValidationError(`Invalid ${err.path}: ${err.value}`, {
      path: err.path,
      value: err.value,
    });
  }
  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((e) => ({
      path: (e as any).path,
      message: e.message,
    }));
    return new ValidationError("Validation failed", details);
  }
  if (err instanceof multer.MulterError) {
    // Common MulterError codes: LIMIT_PART_COUNT, LIMIT_FILE_SIZE, LIMIT_FILE_COUNT, LIMIT_FIELD_KEY
    const code = err.code;
    const status = code === "LIMIT_FILE_SIZE" ? 413 : 400;
    const message =
      code === "LIMIT_FILE_SIZE"
        ? "File too large"
        : code === "LIMIT_UNEXPECTED_FILE"
        ? "Unsupported file type or unexpected field"
        : "Upload error";
    return new ValidationError(message, {
      status,
      code,
      field: (err as any).field,
    });
  }
  if (
    typeof err === "object" &&
    err !== null &&
    Array.isArray((err as any).errors)
  ) {
    return new ValidationError("Validation failed", (err as any).errors);
  }
  if (typeof err === "object" && err !== null && (err as any).status === 401) {
    return new AppError((err as any).message || "Unauthorized", 401, {
      isOperational: true,
    });
  }
  const anyErr = err as any;
  return new AppError(anyErr?.message || "Internal Server Error", 500, {
    isOperational: false,
  });
};

export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  _next
): void => {
  const env = process.env.NODE_ENV || "development";
  const appErr = mapToAppError(err);

  if (env === "production") {
    // eslint-disable-next-line no-console
    console.error(`[err] ${appErr.statusCode} ${appErr.message}`, {
      path: req.originalUrl,
      method: req.method,
      code: (err as any)?.code,
      details: (appErr as any)?.details,
    });
  } else {
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

  const payload: Record<string, unknown> = { ...base };
  if (appErr.statusCode >= 400 && appErr.statusCode < 500 && appErr.details) {
    payload.details = appErr.details;
  }
  res.status(appErr.statusCode).json(payload);
  return;
};
