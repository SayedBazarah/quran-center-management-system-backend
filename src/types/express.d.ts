import { IRole } from "@/models/role";
import "express";

declare global {
  namespace Express {
    interface Session {
      accessTokenIssuedAt: Date;
      refreshTokenIssuedAt: Date;
      expiresAt: Date;
    }
    interface Request {
      validatedParams?: Record<string, any>;
      validatedQuery?: Record<string, any>;
    }
    interface User {
      id: string;
      name: string;
      username: string;
      roleId: IRole;
    }
  }
}
declare module "express-serve-static-core" {
  interface Request {
    validatedParams?: Record<string, any>;
    validatedQuery?: Record<string, any>;
  }
}

export {};
