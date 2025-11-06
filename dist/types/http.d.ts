import type { RequestHandler } from "express";
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
export type TypedHandler<P = Record<string, string>, // route params
Res = SuccessResponse, // response body
Body = unknown, // request body
Query = Record<string, any>> = RequestHandler<P, Res, Body, Query>;
//# sourceMappingURL=http.d.ts.map