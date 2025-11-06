// src/middlewares/authorization.ts
import type { Request, Response, NextFunction } from "express";

export function requirePermissions(...required: string[]) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.user || !Array.isArray(req.user?.roleId?.permissions)) {
      res
        .status(403)
        .json({ success: false, message: "Insufficient permissions" });
      return;
    }

    const codes = (req.user.roleId?.permissions || []).map((p: any) =>
      `${p.code}`.toUpperCase()
    ); // derive codes from session [web:366]

    // Check all required permissions are present
    const hasAll = required.every((r) => codes.includes(r)); // every required code must exist [web:366]
    if (!hasAll) {
      res
        .status(403)
        .json({ success: false, message: "Insufficient permissions" });
      return;
    }

    next();
  };
}
