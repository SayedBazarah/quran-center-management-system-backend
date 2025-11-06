"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const passport_1 = __importDefault(require("passport"));
const middlewares_1 = require("../middlewares");
const AuthRouter = (0, express_1.Router)();
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
    passport_1.default.authenticate("local", cb)(req, res, next);
}, controllers_1.signInSuccess);
// GET /api/v1/auth/me
AuthRouter.get("/me", middlewares_1.isAuthenticated, controllers_1.me);
// POST /api/v1/auth/sign-out
AuthRouter.post("/sign-out", controllers_1.signOut);
exports.default = AuthRouter;
