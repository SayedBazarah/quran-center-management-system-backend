import type { Request, Response, NextFunction } from "express";
export declare function requirePermissions(...required: string[]): (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authorization.d.ts.map