import { Request, Response, NextFunction } from "express";

/**
 * POST /auth/sign-in
 * Uses passport local strategy; this controller assumes passport.authenticate ran earlier
 */
export const signInSuccess = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  // At this point, req.user is set and session persisted
  res.status(200).json({
    success: true,
    message: "Signed in successfully",
    user: req.user,
  });
  return;
};

/**
 * GET /auth/me
 * Returns the current session user, if authenticated
 */
export const me = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  console.log("--- Logs ===", {
    user: req.user,
  });
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }
  res.status(200).json({ success: true, user: req.user });
  return;
};

/**
 * POST /auth/sign-out
 * Destroys session
 */
export const signOut = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  req.logout?.((err) => {
    if (err) return next(err);
    req.session.destroy?.(() => {
      res.clearCookie(process.env.SESSION_NAME || "sid");
      res.status(200).json({ success: true, message: "Signed out" });
    });
  });
};
