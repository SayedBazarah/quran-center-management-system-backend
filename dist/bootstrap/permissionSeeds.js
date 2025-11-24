"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSION_SEEDS = exports.GlobalPermissionCode = void 0;
// src/bootstrap/permissionSeeds.ts
var GlobalPermissionCode;
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
})(GlobalPermissionCode || (exports.GlobalPermissionCode = GlobalPermissionCode = {}));
exports.PERMISSION_SEEDS = [
    { code: GlobalPermissionCode.CreateAdmin, name: "اضافة موظف", order: 1 },
    { code: GlobalPermissionCode.ReadAdmin, name: "الاطلاع علي بيانات الموظفين", order: 1 },
    { code: GlobalPermissionCode.DeleteAdmin, name: "مسح بيانات موظف", order: 1 },
    { code: GlobalPermissionCode.UpdateAdmin, name: "تعديل بيانات موظف", order: 1 },
    // -----------------------------------------------------------------------------
    { code: GlobalPermissionCode.CreateTeacher, name: "اضافة معلم", order: 2 },
    { code: GlobalPermissionCode.ReadTeacher, name: "الاطلاع علي بيانات المعلمين", order: 2 },
    { code: GlobalPermissionCode.DeleteTeacher, name: "مسح بيانات معلم", order: 2 },
    { code: GlobalPermissionCode.UpdateTeacher, name: "تعديل بيانات معلم", order: 2 },
    // -----------------------------------------------------------------------------
    { code: GlobalPermissionCode.CreateStudent, name: "اضافة طالب", order: 0 },
    { code: GlobalPermissionCode.ReadStudent, name: "الاطلاع علي بيانات الطلاب", order: 0 },
    { code: GlobalPermissionCode.DeleteStudent, name: "مسح بيانات طالب", order: 0 },
    { code: GlobalPermissionCode.UpdateStudent, name: "تعديل بيانات طالب", order: 0 },
    { code: GlobalPermissionCode.AcceptStudent, name: "قبول تسجيل الطلاب الجدد", order: 0 },
    {
        code: GlobalPermissionCode.AcceptEnrollment,
        name: "قبول تسجيل مرحلة", order: 0
    },
    { code: GlobalPermissionCode.FireStudent, name: "فصل طلاب", order: 0 },
    { code: GlobalPermissionCode.ReactiveStudent, name: "اعادة قيد الطلاب", order: 0 },
    // { code: GlobalPermissionCode.CreateEnrollment, name: "تسجيل مرحلة للطلاب" },
    {
        code: GlobalPermissionCode.UpdateEnrollment,
        name: "تعديل بيانات المراحل للطلاب",
        order: 0
    },
    { code: GlobalPermissionCode.DeleteEnrollment, name: "الغاء تسجيل مرحلة", order: 0 },
    // -----------------------------------------------------------------------------
    { code: GlobalPermissionCode.CreateCourse, name: "اضافة مرحلة", order: 3 },
    { code: GlobalPermissionCode.ReadCourse, name: "قراءة بيانات المراحل", order: 3 },
    { code: GlobalPermissionCode.DeleteCourse, name: "مسح بيانات مرحلة", order: 3 },
    { code: GlobalPermissionCode.UpdateCourse, name: "تعديل بيانات مرحلة", order: 3 },
    // -----------------------------------------------------------------------------
    { code: GlobalPermissionCode.CreateBranch, name: "اضافة فرع", order: 4 },
    { code: GlobalPermissionCode.ReadBranch, name: "الاطلاع على الفروع", order: 4 },
    { code: GlobalPermissionCode.DeleteBranch, name: "مسح بيانات فرع", order: 4 },
    { code: GlobalPermissionCode.UpdateBranch, name: "تعديل بيانات فرع", order: 4 },
    // -----------------------------------------------------------------------------
    { code: GlobalPermissionCode.CreateRole, name: "اضافة وظيفة", order: 5 },
    { code: GlobalPermissionCode.ReadRole, name: "الاطلاع علي الوظائف", order: 5 },
    { code: GlobalPermissionCode.DeleteRole, name: "مسح وظيفة", order: 5 },
    { code: GlobalPermissionCode.UpdateRole, name: "تعديل وظيفة", order: 5 },
    // -----------------------------------------------------------------------------
    { code: GlobalPermissionCode.ReadReports, name: "الاطلاع على التقارير", order: -1 },
];
