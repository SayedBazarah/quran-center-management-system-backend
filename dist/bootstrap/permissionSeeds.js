// src/bootstrap/permissionSeeds.ts
export var GlobalPermissionCode;
(function (GlobalPermissionCode) {
    GlobalPermissionCode["CreateAdmin"] = "CREATE.ADMIN";
    GlobalPermissionCode["ReadAdmin"] = "READ.ADMIN";
    GlobalPermissionCode["DeleteAdmin"] = "DELETE.ADMIN";
    GlobalPermissionCode["UpdateAdmin"] = "UPDATE.ADMIN";
    GlobalPermissionCode["CreateTeacher"] = "CREATE.TEACHER";
    GlobalPermissionCode["ReadTeacher"] = "READ.TEACHER";
    GlobalPermissionCode["DeleteTeacher"] = "DELETE.TEACHER";
    GlobalPermissionCode["UpdateTeacher"] = "UPDATE.TEACHER";
    GlobalPermissionCode["CreateStudent"] = "CREATE.STUDENT";
    GlobalPermissionCode["ReadStudent"] = "READ.STUDENT";
    GlobalPermissionCode["DeleteStudent"] = "DELETE.STUDENT";
    GlobalPermissionCode["UpdateStudent"] = "UPDATE.STUDENT";
    GlobalPermissionCode["AcceptStudent"] = "ACCEPT.STUDENT";
    GlobalPermissionCode["CreateEnrollment"] = "CREATE.ENROLLMENT";
    GlobalPermissionCode["UpdateEnrollment"] = "UPDATE.ENROLLMENT";
    GlobalPermissionCode["ReadEnrollment"] = "READ.ENROLLMENT";
    GlobalPermissionCode["DeleteEnrollment"] = "DELETE.ENROLLMENT";
    GlobalPermissionCode["AcceptEnrollment"] = "ACCEPT.ENROLLMENT";
    GlobalPermissionCode["CreateCourse"] = "CREATE.COURSE";
    GlobalPermissionCode["ReadCourse"] = "READ.COURSE";
    GlobalPermissionCode["DeleteCourse"] = "DELETE.COURSE";
    GlobalPermissionCode["UpdateCourse"] = "UPDATE.COURSE";
    GlobalPermissionCode["CreateBranch"] = "CREATE.BRANCH";
    GlobalPermissionCode["ReadBranch"] = "READ.BRANCH";
    GlobalPermissionCode["DeleteBranch"] = "DELETE.BRANCH";
    GlobalPermissionCode["UpdateBranch"] = "UPDATE.BRANCH";
    GlobalPermissionCode["CreateRole"] = "CREATE.ROLE";
    GlobalPermissionCode["ReadRole"] = "READ.ROLE";
    GlobalPermissionCode["DeleteRole"] = "DELETE.ROLE";
    GlobalPermissionCode["UpdateRole"] = "UPDATE.ROLE";
    GlobalPermissionCode["ReadReports"] = "READ.REPORTS";
    GlobalPermissionCode["FireStudent"] = "FIRE.STUDENT";
    GlobalPermissionCode["ReactiveStudent"] = "REACTIVE.STUDENT";
})(GlobalPermissionCode || (GlobalPermissionCode = {}));
export const PERMISSION_SEEDS = [
    { code: GlobalPermissionCode.CreateAdmin, name: "اضافة موظف" },
    { code: GlobalPermissionCode.ReadAdmin, name: "قراءة بيانات الموظفين" },
    { code: GlobalPermissionCode.DeleteAdmin, name: "مسح بيانات موظف" },
    { code: GlobalPermissionCode.UpdateAdmin, name: "تعديل بيانات موظف" },
    // -----------------------------------------------------------------------------
    { code: GlobalPermissionCode.CreateTeacher, name: "اضافة معلم" },
    { code: GlobalPermissionCode.ReadTeacher, name: "قراءة بيانات المعلمين" },
    { code: GlobalPermissionCode.DeleteTeacher, name: "مسح بيانات معلم" },
    { code: GlobalPermissionCode.UpdateTeacher, name: "تعديل بيانات معلم" },
    // -----------------------------------------------------------------------------
    { code: GlobalPermissionCode.CreateStudent, name: "اضافة طالب" },
    { code: GlobalPermissionCode.ReadStudent, name: "قراءة بيانات الطالبين" },
    { code: GlobalPermissionCode.DeleteStudent, name: "مسح بيانات طالب" },
    { code: GlobalPermissionCode.UpdateStudent, name: "تعديل بيانات طالب" },
    { code: GlobalPermissionCode.AcceptStudent, name: "قبول تسجيل الطلاب الجدد" },
    {
        code: GlobalPermissionCode.AcceptEnrollment,
        name: "قبول تسجيل مرحلة",
    },
    { code: GlobalPermissionCode.FireStudent, name: "فصل طلاب" },
    { code: GlobalPermissionCode.ReactiveStudent, name: "اعادة قيد الطلاب" },
    { code: GlobalPermissionCode.CreateEnrollment, name: "تسجيل مرحلة للطلاب" },
    {
        code: GlobalPermissionCode.UpdateEnrollment,
        name: "تعديل بيانات المراحل للطلاب",
    },
    { code: GlobalPermissionCode.DeleteEnrollment, name: "الغاء تسجيل مرحلة" },
    // -----------------------------------------------------------------------------
    { code: GlobalPermissionCode.CreateCourse, name: "اضافة مرحلة" },
    { code: GlobalPermissionCode.ReadCourse, name: "قراءة بيانات المراحل" },
    { code: GlobalPermissionCode.DeleteCourse, name: "مسح بيانات مرحلة" },
    { code: GlobalPermissionCode.UpdateCourse, name: "تعديل بيانات مرحلة" },
    // -----------------------------------------------------------------------------
    { code: GlobalPermissionCode.CreateBranch, name: "اضافة فرع" },
    { code: GlobalPermissionCode.ReadBranch, name: "الاطلاع على الفروع" },
    { code: GlobalPermissionCode.DeleteBranch, name: "مسح بيانات فرع" },
    { code: GlobalPermissionCode.UpdateBranch, name: "تعديل بيانات فرع" },
    // -----------------------------------------------------------------------------
    { code: GlobalPermissionCode.CreateRole, name: "اضافة وظيفة" },
    { code: GlobalPermissionCode.ReadRole, name: "الاطلاع الوظائف" },
    { code: GlobalPermissionCode.DeleteRole, name: "مسح وظيفة" },
    { code: GlobalPermissionCode.UpdateRole, name: "تعديل وظيفة" },
    // -----------------------------------------------------------------------------
    { code: GlobalPermissionCode.ReadReports, name: "الاطلاع على التقارير" },
];
//# sourceMappingURL=permissionSeeds.js.map