export declare enum GlobalPermissionCode {
    CreateAdmin = "CREATE.ADMIN",
    ReadAdmin = "READ.ADMIN",
    DeleteAdmin = "DELETE.ADMIN",
    UpdateAdmin = "UPDATE.ADMIN",
    CreateTeacher = "CREATE.TEACHER",
    ReadTeacher = "READ.TEACHER",
    DeleteTeacher = "DELETE.TEACHER",
    UpdateTeacher = "UPDATE.TEACHER",
    CreateStudent = "CREATE.STUDENT",
    ReadStudent = "READ.STUDENT",
    DeleteStudent = "DELETE.STUDENT",
    UpdateStudent = "UPDATE.STUDENT",
    AcceptStudent = "ACCEPT.STUDENT",
    CreateEnrollment = "CREATE.ENROLLMENT",
    UpdateEnrollment = "UPDATE.ENROLLMENT",
    ReadEnrollment = "READ.ENROLLMENT",
    DeleteEnrollment = "DELETE.ENROLLMENT",
    AcceptEnrollment = "ACCEPT.ENROLLMENT",
    CreateCourse = "CREATE.COURSE",
    ReadCourse = "READ.COURSE",
    DeleteCourse = "DELETE.COURSE",
    UpdateCourse = "UPDATE.COURSE",
    CreateBranch = "CREATE.BRANCH",
    ReadBranch = "READ.BRANCH",
    DeleteBranch = "DELETE.BRANCH",
    UpdateBranch = "UPDATE.BRANCH",
    CreateRole = "CREATE.ROLE",
    ReadRole = "READ.ROLE",
    DeleteRole = "DELETE.ROLE",
    UpdateRole = "UPDATE.ROLE",
    ReadReports = "READ.REPORTS",
    FireStudent = "FIRE.STUDENT",
    ReactiveStudent = "REACTIVE.STUDENT"
}
export declare const PERMISSION_SEEDS: Array<{
    code: GlobalPermissionCode;
    name: string;
    description?: string;
}>;
//# sourceMappingURL=permissionSeeds.d.ts.map