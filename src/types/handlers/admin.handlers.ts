import { SuccessResponse, TypedHandler } from "../http";

export type CommonAdminFields = {
  name: string;
  email?: string; // often optional on create
  phone: string;
  username: string;
  nationalId: string;
  gender: string;
};

// Create: required fields (add password if applicable)
export type CreateAdminBody = CommonAdminFields & {
  branchIds: string[];
  roleId: string;
  password: string;
};

// Update: partial fields
export type UpdateAdminBody = Partial<CommonAdminFields> & {
  branchIds?: string;
  roleId?: string;
  password?: string;
  nationalIdImg?: string;
};

export type CreateAdminHandler = TypedHandler<
  Record<string, never>, // no params
  SuccessResponse<{ id: string }>, // response data
  CreateAdminBody, // body
  Record<string, never> // no query
>;

// Update by id
export type UpdateAdminHandler = TypedHandler<
  { id: string }, // params
  SuccessResponse, // response
  UpdateAdminBody, // body
  Record<string, never>
>;

// Get by id
export type GetAdminHandler = TypedHandler<
  { id: string },
  SuccessResponse<{ id: string; name: string; username: string }>
>;

// List with paging
export type ListAdminsHandler = TypedHandler<
  Record<string, never>,
  SuccessResponse<{
    items: Array<{ id: string; name: string }>;
    total: number;
  }>,
  unknown,
  { page?: string; limit?: string; search?: string }
>;

// Delete
export type DeleteAdminHandler = TypedHandler<{ id: string }, SuccessResponse>;
