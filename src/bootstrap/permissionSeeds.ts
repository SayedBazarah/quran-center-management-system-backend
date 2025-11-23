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
  order: number;
}> = [
  { code: GlobalPermissionCode.CreateAdmin, name: "اضافة موظف", order: 1 },
  { code: GlobalPermissionCode.ReadAdmin, name: "الاطلاع علي بيانات الموظفين", order: 1 },
  { code: GlobalPermissionCode.DeleteAdmin, name: "مسح بيانات موظف" , order: 1},
  { code: GlobalPermissionCode.UpdateAdmin, name: "تعديل بيانات موظف" , order: 1},
  // -----------------------------------------------------------------------------
  { code: GlobalPermissionCode.CreateTeacher, name: "اضافة معلم", order: 2 },
  { code: GlobalPermissionCode.ReadTeacher, name: "الاطلاع علي بيانات المعلمين" , order: 2},
  { code: GlobalPermissionCode.DeleteTeacher, name: "مسح بيانات معلم" , order: 2},
  { code: GlobalPermissionCode.UpdateTeacher, name: "تعديل بيانات معلم", order: 2 },
  // -----------------------------------------------------------------------------
  { code: GlobalPermissionCode.CreateStudent, name: "اضافة طالب", order: 0 },
  { code: GlobalPermissionCode.ReadStudent, name: "الاطلاع علي بيانات الطلاب", order: 0 },
  { code: GlobalPermissionCode.DeleteStudent, name: "مسح بيانات طالب" , order: 0},
  { code: GlobalPermissionCode.UpdateStudent, name: "تعديل بيانات طالب", order: 0 },
  { code: GlobalPermissionCode.AcceptStudent, name: "قبول تسجيل الطلاب الجدد", order: 0 },
  {
    code: GlobalPermissionCode.AcceptEnrollment,
    name: "قبول تسجيل مرحلة",order: 0
  },
  { code: GlobalPermissionCode.FireStudent, name: "فصل طلاب", order: 0 },
  { code: GlobalPermissionCode.ReactiveStudent, name: "اعادة قيد الطلاب", order: 0},
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
  { code: GlobalPermissionCode.DeleteCourse, name: "مسح بيانات مرحلة" , order: 3},
  { code: GlobalPermissionCode.UpdateCourse, name: "تعديل بيانات مرحلة", order: 3 },
  // -----------------------------------------------------------------------------
  { code: GlobalPermissionCode.CreateBranch, name: "اضافة فرع", order: 4 },
  { code: GlobalPermissionCode.ReadBranch, name: "الاطلاع على الفروع", order: 4 },
  { code: GlobalPermissionCode.DeleteBranch, name: "مسح بيانات فرع", order: 4 },
  { code: GlobalPermissionCode.UpdateBranch, name: "تعديل بيانات فرع" , order: 4},
  // -----------------------------------------------------------------------------
  { code: GlobalPermissionCode.CreateRole, name: "اضافة وظيفة", order: 5 },
  { code: GlobalPermissionCode.ReadRole, name: "الاطلاع علي الوظائف" , order: 5},
  { code: GlobalPermissionCode.DeleteRole, name: "مسح وظيفة" , order: 5},
  { code: GlobalPermissionCode.UpdateRole, name: "تعديل وظيفة", order: 5 },
  // -----------------------------------------------------------------------------
  { code: GlobalPermissionCode.ReadReports, name: "الاطلاع على التقارير", order: -1 },
];
