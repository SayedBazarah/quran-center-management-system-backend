import { Router, Request, Response, NextFunction } from "express";
import { signInSuccess, me, signOut } from "@/controllers";
import passport, { AuthenticateCallback } from "passport";
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
  signInSuccess
);

// GET /api/v1/auth/me
AuthRouter.get("/me", isAuthenticated, me);

// POST /api/v1/auth/sign-out
AuthRouter.post("/sign-out", signOut);

export default AuthRouter;
