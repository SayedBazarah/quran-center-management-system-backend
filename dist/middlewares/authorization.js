"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermissions = requirePermissions;
function requirePermissions(...required) {
    return async (req, res, next) => {
        if (!req.user || !Array.isArray(req.user?.roleId?.permissions)) {
            res
                .status(403)
                .json({ success: false, message: "Insufficient permissions" });
            return;
        }
        const codes = (req.user.roleId?.permissions || []).map((p) => `${p.code}`.toUpperCase()); // derive codes from session [web:366]
        // Check all required permissions are present
        const hasAll = required.every((r) => codes.includes(r)); // every required code must exist [web:366]
        if (!hasAll) {
            res
                .status(403)
                .json({ success: false, message: "Insufficient permissions" });
            return;
        }
        next();
    };
}
