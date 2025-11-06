import { Router, Request, Response, NextFunction } from "express";
import passport from "@config/passport";
import { asyncHandler } from "@utils/asyncHandler";
import { signInSuccess, me, signOut } from "@/controllers";
import { AuthenticateCallback } from "passport";
import { isAuthenticated } from "@/middlewares";

const AuthRouter = Router();

// POST /api/v1/auth/sign-in
AuthRouter.post(
  "/sign-in",
  (req: Request, res: Response, next: NextFunction) => {
    // Explicitly annotate callback to avoid implicit any
    const cb: AuthenticateCallback = (
      err: any,
      user: Express.User | false | null | undefined,
      info?: object | string
    ) => {
      if (err || !user) return next(err);
      if (!user) {
        res.status(401).json({
          success: false,
          message:
            (typeof info === "object" && (info as any)?.message) ||
            "Unauthorized",
        });
        return;
      }
      req.logIn(user, (err2) => {
        if (err2) return next(err2);
        return next();
      });
    };

    passport.authenticate("local", cb)(req, res, next);
  },
  asyncHandler(signInSuccess)
);

// GET /api/v1/auth/me
AuthRouter.get("/me", isAuthenticated, me);

// POST /api/v1/auth/sign-out
AuthRouter.post("/sign-out", asyncHandler(signOut));

export default AuthRouter;
