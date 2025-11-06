// src/middlewares/notFound.ts
import type { Request, Response, NextFunction } from "express";

export function notFound(req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
}
