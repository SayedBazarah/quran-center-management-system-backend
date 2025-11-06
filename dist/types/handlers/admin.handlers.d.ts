import { SuccessResponse, TypedHandler } from "../http";
export type CommonAdminFields = {
    name: string;
    email?: string;
    phone: string;
    username: string;
    nationalId: string;
    gender: string;
};
export type CreateAdminBody = CommonAdminFields & {
    branchIds: string[];
    roleId: string;
    password: string;
};
export type UpdateAdminBody = Partial<CommonAdminFields> & {
    branchIds?: string;
    roleId?: string;
    password?: string;
    nationalIdImg?: string;
};
export type CreateAdminHandler = TypedHandler<Record<string, never>, // no params
SuccessResponse<{
    id: string;
}>, // response data
CreateAdminBody, // body
Record<string, never>>;
export type UpdateAdminHandler = TypedHandler<{
    id: string;
}, // params
SuccessResponse, // response
UpdateAdminBody, // body
Record<string, never>>;
export type GetAdminHandler = TypedHandler<{
    id: string;
}, SuccessResponse<{
    id: string;
    name: string;
    username: string;
}>>;
export type ListAdminsHandler = TypedHandler<Record<string, never>, SuccessResponse<{
    items: Array<{
        id: string;
        name: string;
    }>;
    total: number;
}>, unknown, {
    page?: string;
    limit?: string;
    search?: string;
}>;
export type DeleteAdminHandler = TypedHandler<{
    id: string;
}, SuccessResponse>;
//# sourceMappingURL=admin.handlers.d.ts.map