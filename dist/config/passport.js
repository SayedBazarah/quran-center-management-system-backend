"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializePassport = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../models"); // or User model if you prefer
// Local strategy: use username or email; adapt to your login field
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: false,
}, async (username, password, done) => {
    try {
        const admin = await models_1.Admin.findOne({
            $or: [
                { username: username.toLowerCase() },
                { email: username.toLowerCase() },
            ],
        })
            .select("+password")
            .populate({
            path: "roleId",
            select: "name permissions",
            populate: {
                path: "permissions",
                select: "code -_id",
            },
        })
            .populate({
            path: "branchIds",
            select: "name",
        })
            .orFail();
        if (!admin || !admin.password) {
            return done(null, false, { message: "Invalid credentials" });
        }
        const ok = await bcryptjs_1.default.compare(password, admin.password);
        if (!ok) {
            return done(null, false, { message: "Invalid credentials" });
        }
        // Sanitize user session payload
        const sessionUser = {
            id: String(admin._id),
            name: admin.name,
            username: admin.username,
            email: admin.email,
            roleId: admin.roleId,
            branchIds: admin.branchIds,
        };
        return done(null, sessionUser);
    }
    catch (err) {
        return done(err);
    }
}));
// Minimal serialize/deserialize; store small object in session to avoid extra DB hits
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
exports.default = passport_1.default;
exports.initializePassport = [passport_1.default.initialize(), passport_1.default.session()];
