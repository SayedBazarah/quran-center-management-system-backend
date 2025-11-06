// src/types/http.ts
import type { RequestHandler } from "express";

// Standard success envelope returned by controllers
export type SuccessResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// Strongly-typed Express handler (async-friendly)
export type TypedHandler<
  P = Record<string, string>, // route params
  Res = SuccessResponse, // response body
  Body = unknown, // request body
  Query = Record<string, any> // query params
> = RequestHandler<P, Res, Body, Query>;
