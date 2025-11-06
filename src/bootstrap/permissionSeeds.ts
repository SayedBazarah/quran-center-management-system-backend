// src/bootstrap/permissionSeeds.ts
export enum GlobalPermissionCode {
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
  ReactiveStudent = "REACTIVE.STUDENT",
}

export const PERMISSION_SEEDS: Array<{
  code: GlobalPermissionCode;
  name: string;
  description?: string;
}> = [
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
