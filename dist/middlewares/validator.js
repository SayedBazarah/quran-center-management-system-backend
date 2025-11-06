"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalValidatorMiddleware = void 0;
const express_validator_1 = require("express-validator");
const errors_1 = require("../errors");
// Use the official formatter fields instead of accessing union properties
const resultWithFormatter = express_validator_1.validationResult.withDefaults({
    formatter: (e) => ({
        field: e.param, // param is the documented name
        message: String(e.msg),
        value: e.value,
        location: e.location,
    }),
});
const globalValidatorMiddleware = (req, _res, next) => {
    const errors = resultWithFormatter(req);
    if (!errors.isEmpty()) {
        return next(new errors_1.ValidationError("Validation failed", errors.array()));
    }
    // Only assign after ensuring no errors
    // Body: overwrite with validated fields
    req.body = (0, express_validator_1.matchedData)(req, { locations: ["body"] });
    // Params and query are read-only on req; attach to custom properties via declaration merging
    // Add types: declare global { namespace Express { interface Request { validatedParams?: any; validatedQuery?: any; } } }
    req.validatedParams = (0, express_validator_1.matchedData)(req, { locations: ["params"] });
    req.validatedQuery = (0, express_validator_1.matchedData)(req, { locations: ["query"] });
    return next();
};
exports.globalValidatorMiddleware = globalValidatorMiddleware;
