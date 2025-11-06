"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = notFound;
function notFound(req, res, _next) {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
    });
}
