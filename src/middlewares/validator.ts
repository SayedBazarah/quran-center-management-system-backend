// src/middlewares/globalValidator.ts
import { RequestHandler } from "express";
import {
  matchedData,
  validationResult,
  ResultFactory,
  ValidationError as EVValidationError,
} from "express-validator";
import { ValidationError } from "@/errors";

// Normalized error shape
type FieldError = {
  field: string;
  message: string;
  value?: unknown;
  location?: string;
};

// Use the official formatter fields instead of accessing union properties
const resultWithFormatter: ResultFactory<FieldError> =
  validationResult.withDefaults({
    formatter: (e: EVValidationError): FieldError => ({
      field: (e as any).param, // param is the documented name
      message: String(e.msg),
      value: (e as any).value,
      location: (e as any).location,
    }),
  });

export const globalValidatorMiddleware: RequestHandler = (req, _res, next) => {
  const errors = resultWithFormatter(req);
  if (!errors.isEmpty()) {
    return next(new ValidationError("Validation failed", errors.array()));
  }

  // Only assign after ensuring no errors
  // Body: overwrite with validated fields
  req.body = matchedData(req, { locations: ["body"] });

  // Params and query are read-only on req; attach to custom properties via declaration merging
  // Add types: declare global { namespace Express { interface Request { validatedParams?: any; validatedQuery?: any; } } }
  (req as any).validatedParams = matchedData(req, { locations: ["params"] });
  (req as any).validatedQuery = matchedData(req, { locations: ["query"] });

  return next();
};
