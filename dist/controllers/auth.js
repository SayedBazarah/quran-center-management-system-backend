"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signOut = exports.me = exports.signInSuccess = void 0;
/**
 * POST /auth/sign-in
 * Uses passport local strategy; this controller assumes passport.authenticate ran earlier
 */
const signInSuccess = async (req, res, _next) => {
    // At this point, req.user is set and session persisted
    res.status(200).json({
        success: true,
        message: "Signed in successfully",
        user: req.user,
    });
    return;
};
exports.signInSuccess = signInSuccess;
/**
 * GET /auth/me
 * Returns the current session user, if authenticated
 */
const me = async (req, res, _next) => {
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
exports.me = me;
/**
 * POST /auth/sign-out
 * Destroys session
 */
const signOut = async (req, res, next) => {
    req.logout?.((err) => {
        if (err)
            return next(err);
        req.session.destroy?.(() => {
            res.clearCookie(process.env.SESSION_NAME || "sid");
            res.status(200).json({ success: true, message: "Signed out" });
        });
    });
};
exports.signOut = signOut;
