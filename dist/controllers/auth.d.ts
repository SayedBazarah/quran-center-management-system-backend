import { Request, Response, NextFunction } from "express";
/**
 * POST /auth/sign-in
 * Uses passport local strategy; this controller assumes passport.authenticate ran earlier
 */
export declare const signInSuccess: (req: Request, res: Response, _next: NextFunction) => Promise<void>;
/**
 * GET /auth/me
 * Returns the current session user, if authenticated
 */
export declare const me: (req: Request, res: Response, _next: NextFunction) => Promise<void>;
/**
 * POST /auth/sign-out
 * Destroys session
 */
export declare const signOut: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map