import { Router } from "express";
import passport from "@config/passport";
import { asyncHandler } from "@utils/asyncHandler";
import { signInSuccess, me, signOut } from "@/controllers";
import { isAuthenticated } from "@/middlewares";
const AuthRouter = Router();
// POST /api/v1/auth/sign-in
AuthRouter.post("/sign-in", (req, res, next) => {
    // Explicitly annotate callback to avoid implicit any
    const cb = (err, user, info) => {
        if (err || !user)
            return next(err);
        if (!user) {
            res.status(401).json({
                success: false,
                message: (typeof info === "object" && info?.message) ||
                    "Unauthorized",
            });
            return;
        }
        req.logIn(user, (err2) => {
            if (err2)
                return next(err2);
            return next();
        });
    };
    passport.authenticate("local", cb)(req, res, next);
}, asyncHandler(signInSuccess));
// GET /api/v1/auth/me
AuthRouter.get("/me", isAuthenticated, me);
// POST /api/v1/auth/sign-out
AuthRouter.post("/sign-out", asyncHandler(signOut));
export default AuthRouter;
//# sourceMappingURL=auth.js.map