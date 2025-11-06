export function isAuthenticated(req, res, next) {
    // Works when passport.session() is mounted; otherwise check req.session
    const authenticated = typeof req.isAuthenticated === "function"
        ? req.isAuthenticated()
        : Boolean(req.user);
    if (!authenticated) {
        res
            .status(401)
            .json({ success: false, message: "Authentication required" });
        return;
    }
    next();
}
//# sourceMappingURL=authentication.js.map