export function notFound(req, res, _next) {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
    });
}
//# sourceMappingURL=not-found.js.map