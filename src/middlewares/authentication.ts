// src/middlewares/authentication.ts
import type { Request, Response, NextFunction } from "express";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Works when passport.session() is mounted; otherwise check req.session
  const authenticated =
    typeof (req as any).isAuthenticated === "function"
      ? (req as any).isAuthenticated()
      : Boolean((req as any).user);

  if (!authenticated) {
    res
      .status(401)
      .json({ success: false, message: "Authentication required" });
    return;
  }
  next();
}
