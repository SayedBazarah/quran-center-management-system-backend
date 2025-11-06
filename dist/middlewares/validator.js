import { matchedData, validationResult, } from "express-validator";
import { ValidationError } from "@/errors";
// Use the official formatter fields instead of accessing union properties
const resultWithFormatter = validationResult.withDefaults({
    formatter: (e) => ({
        field: e.param, // param is the documented name
        message: String(e.msg),
        value: e.value,
        location: e.location,
    }),
});
export const globalValidatorMiddleware = (req, _res, next) => {
    const errors = resultWithFormatter(req);
    if (!errors.isEmpty()) {
        return next(new ValidationError("Validation failed", errors.array()));
    }
    // Only assign after ensuring no errors
    // Body: overwrite with validated fields
    req.body = matchedData(req, { locations: ["body"] });
    // Params and query are read-only on req; attach to custom properties via declaration merging
    // Add types: declare global { namespace Express { interface Request { validatedParams?: any; validatedQuery?: any; } } }
    req.validatedParams = matchedData(req, { locations: ["params"] });
    req.validatedQuery = matchedData(req, { locations: ["query"] });
    return next();
};
//# sourceMappingURL=validator.js.map