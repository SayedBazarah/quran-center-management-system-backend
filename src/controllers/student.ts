// src/controllers/studentController.ts
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { Student, Enrollment, Admin, Log } from "@/models";
import { EnrollmentStatus, StudentStatus } from "@/types/enums";
import { MediaCategory, saveMulterFile } from "@/utils/file";
import { env } from "@/env";
import enrollment from "@/models/enrollment";
import teacher from "@/models/teacher";
import { enrollmentStatus } from "./enrollment";

// Shared list parser with pagination, search, sorting
function parseListQuery(q: Request["query"]) {
  // Check if requesting all students
  const returnAll = q.all === "true" || q.limit === "all";
  console.log("returnAll");
  console.log(returnAll);
  const page = returnAll ? 1 : Math.max(parseInt(String(q.page ?? "1"), 10), 1);
  const limit = returnAll
    ? 0 // 0 means no limit in MongoDB
    : Math.min(Math.max(parseInt(String(q.limit ?? "20"), 10), 1), 100);
  const skip = returnAll ? 0 : (page - 1) * limit;

  const search = String(q.search ?? "").trim();
  const filter: Record<string, any> = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { nationalId: { $regex: search, $options: "i" } },
    ];
  }

  if (q.branchId && Types.ObjectId.isValid(String(q.branchId))) {
    filter.branchId = new Types.ObjectId(String(q.branchId));
  }

  if (
    q.status &&
    Object.values<string>(StudentStatus).includes(String(q.status))
  ) {
    filter.status = String(q.status);
  }

  const sortRaw = String(q.sort ?? "-createdAt");
  const sort: Record<string, 1 | -1> = {};
  sortRaw.split(",").forEach((token) => {
    const t = token.trim();
    if (!t) return;
    if (t.startsWith("-")) sort[t.slice(1)] = -1;
    else sort[t] = 1;
  });

  return { page, limit, skip, filter, sort };
}

/**
 * Create Student
 * Required: name, phone, nationalId
 */
export const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      nationalId,
      birthDate,
      gender,
      address,
      branchId,
      adminId, // creator admin (optional trace)
    } = req.body;

    if (!req.file) {
      res.status(400).json({ success: false, message: "No file uploaded" });
      return;
    }

    if (branchId && !Types.ObjectId.isValid(branchId)) {
      res.status(400).json({ success: false, message: "Invalid branchId" });
      return;
    }
    if (adminId && !Types.ObjectId.isValid(adminId)) {
      res.status(400).json({ success: false, message: "Invalid adminId" });
      return;
    }

    if (adminId) {
      const admin = await Admin.findById(adminId);
      if (!admin) {
        res.status(404).json({ success: false, message: "Admin not found" });
        return;
      }
    }

    const { filename } = await saveMulterFile(MediaCategory.Student, req.file);

    const student = await Student.create({
      name,
      email,
      phone,
      nationalId,
      birthDate,
      gender,
      address,
      branchId,
      adminId,
      status: StudentStatus.PENDING,
      createdBy: req.user?.id,
      nationalIdImg: `${env.media}/${MediaCategory.Student}/${filename}`,
    });

    await Log.create({
      studentId: student._id,
      adminId: new Types.ObjectId(`${req.user?.id}`),
      note: `تم تسجيل بيانات الطالب بواسطة  ${req.user?.name}`,
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (err) {
    next(err);
    return;
  }
};

/**
 * Edit Student by ID
 */
export const updateStudentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid student id" });
      return;
    }

    const {
      name,
      email,
      phone,
      nationalId,
      nationalIdImg,
      avatar,
      birthDate,
      gender,
      address,
      branchId,
      status,
      acceptedById, // optional update
    } = req.body;

    if (branchId && !Types.ObjectId.isValid(branchId)) {
      res.status(400).json({ success: false, message: "Invalid branchId" });
      return;
    }
    if (acceptedById && !Types.ObjectId.isValid(acceptedById)) {
      res.status(400).json({ success: false, message: "Invalid acceptedById" });
      return;
    }

    const updated = await Student.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(typeof name !== "undefined" && { name }),
          ...(typeof email !== "undefined" && { email }),
          ...(typeof phone !== "undefined" && { phone }),
          ...(typeof nationalId !== "undefined" && { nationalId }),
          ...(typeof nationalIdImg !== "undefined" && { nationalIdImg }),
          ...(typeof avatar !== "undefined" && { avatar }),
          ...(typeof birthDate !== "undefined" && { birthDate }),
          ...(typeof gender !== "undefined" && { gender }),
          ...(typeof address !== "undefined" && { address }),
          ...(typeof branchId !== "undefined" && { branchId }),
          ...(typeof status !== "undefined" && { status }),
          ...(typeof acceptedById !== "undefined" && { acceptedById }),
        },
      },
      { new: false, runValidators: true, context: "query" }
    );

    await Log.create({
      studentId: id,
      adminId: new Types.ObjectId(`${req.user?.id}`),
      note: `تم تعديل بيانات الطالب بواسطة  ${req.user?.name}`,
    });

    if (!updated) {
      res.status(404).json({ success: false, message: "Student not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updated,
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

/**
 * Delete Student by ID
 */
export const deleteStudentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid student id" });
      return;
    }

    const existing = await Student.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: "Student not found" });
      return;
    }

    await Student.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

/**
 * Student details by ID
 * Includes aggregated current enrollments count (optional), you can expand as needed
 */
export const getStudentDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid student id" });
      return;
    }

    const student = await Student.findById(id).populate(
      "branchId parentId adminId acceptedById firedById"
    );
    if (!student) {
      res.status(404).json({ success: false, message: "Student not found" });
      return;
    }

    res.status(200).json({
      success: true,
      data: student,
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

/**
 * List students with enrollment summary:
 * Return students plus latest enrollment for each student (startDate, endDate, course name)
 * You can also add a query param latest=true to restrict to latest enrollment only.
 */

export const listStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit, skip, filter, sort } = parseListQuery(req.query);

    const [items, total] = await Promise.all([
      Student.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate({
          path: "adminId",
          populate: {
            path: "name",
          },
        }),
      Student.countDocuments(filter),
    ]);
    res.status(200).json({
      success: true,
      data: { students: items, enrollment: [] },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};
export const listStudentsWithEnrollment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit, skip, filter, sort } = parseListQuery(req.query);
    const latestOnly =
      String(req.query.latest ?? "true").toLowerCase() === "true";
    const adminBranchIds: string[] = (req.user as any)?.branchIds || [];

    if (!adminBranchIds.length) {
      res.status(403).json({ success: false, message: "No branch access" });
      return;
    }
    const newFilter = {
      ...filter,
      branchId: { $in: adminBranchIds.map((id) => new Types.ObjectId(id)) },
    };

    // Base students page
    const students = await Student.find(newFilter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "adminId",
        populate: {
          path: "name",
        },
      })
      .populate({
        path: "branchId",
        populate: {
          path: "name",
        },
      });

    const total = await Student.countDocuments(filter);

    // For each student, fetch latest enrollment and course name
    const studentIds = students.map((s) => s._id);

    // 1) Active (current) enrollment per student
    const active = await Enrollment.find({
      studentId: { $in: studentIds },
      status: {
        $in: [
          EnrollmentStatus.ACTIVE,
          EnrollmentStatus.LATE,
          EnrollmentStatus.PENDING,
        ],
      },
    })
      .select("studentId startDate status courseId teacherId")
      .populate({ path: "courseId", select: "name _id id duration" })
      .populate({ path: "teacherId", select: "name _id id" })
      .lean();

    const activeMap = new Map<string, any>();
    for (const e of active) {
      const sid = String(e.studentId);
      const prev = activeMap.get(sid);
      if (!prev || e.createdAt > prev.createdAt) activeMap.set(sid, e);
    }

    // 2) All enrollments per student (optionally limit N most recent)
    const all = await Enrollment.find({ studentId: { $in: studentIds } })
      .sort({ createdAt: -1 })
      .select("studentId status courseId teacherId")
      .populate({ path: "courseId", select: "name _id duration" })
      .populate({ path: "teacherId", select: "name _id" })
      .lean();

    const allMap = new Map<string, any[]>();
    for (const e of all) {
      const sid = String(e.studentId);
      if (!allMap.has(sid)) allMap.set(sid, []);
      allMap.get(sid)!.push(e);
    }

    // 3) Merge into response
    const data = students.map((s) => {
      const sid = String(s._id);
      return {
        student: s,
        currentEnrollment: activeMap.get(sid) || null,
        enrollments: allMap.get(sid) || [],
      };
    });

    res.status(200).json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

/**
 * List all pending students (waiting to be accepted)
 */
export const listPendingStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit, skip, sort } = parseListQuery(req.query);

    const filter = { status: StudentStatus.PENDING };
    const [items, total] = await Promise.all([
      Student.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate({
          path: "branchId",
          select: "name",
        })
        .populate({
          path: "createdBy",
          select: "name",
        })
        .populate({
          path: "adminId",
          select: "name",
        }),
      Student.countDocuments(filter),
    ]);
    res.status(200).json({
      success: true,
      data: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

/**
 * Accept student (status -> active; set acceptedById)
 */
export const acceptStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid student id" });
      return;
    }

    const student = await Student.findById(id);

    if (!student) {
      res.status(404).json({ success: false, message: "Student not found" });
      return;
    }

    student.status = StudentStatus.ACTIVE;
    student.acceptedById = new Types.ObjectId(`${req.user?.id}`);
    await student.save();

    await Log.create({
      studentId: student._id,
      adminId: new Types.ObjectId(`${req.user?.id}`),
      note: `تم قبول التحاق الطالب بالمركز بواسطة ${req.user?.name}`,
    });

    res.status(200).json({
      success: true,
      message: "Student accepted (status set to active)",
      data: student,
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

/**
 * Reject student (status -> dropout)
 */
export const updateStudentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("--- Update student status ----");
    const { id } = req.params;
    const { status, reason } = req.body;
    const update: any = { status };
    const now = new Date();

    if (status === StudentStatus.ACTIVE) {
      update.status = StudentStatus.ACTIVE;
      update.acceptedById = req.user?.id;
      update.acceptedAt = now;
    } else if (status === StudentStatus.REJECTED) {
      update.status = StudentStatus.REJECTED;
      update.rejectedById = req.user?.id;
      update.rejectionReason = reason;
      update.rejectedAt = now;
    }

    const updated = await Student.findOneAndUpdate(
      { _id: id, status: { $in: ["pending", status] } }, // simple transition guard
      { $set: update },
      { new: true, runValidators: true, context: "query" }
    );
    if (!updated) {
      res.status(404).json({
        success: false,
        message: "Student not found or invalid transition",
      });
      return;
    }

    await Log.create({
      studentId: id,
      adminId: req.user?.id,
      note:
        status === "accepted"
          ? "تم قبول الطالب"
          : `تم رفض الطالب، بسبب ${reason}`,
      changes: [
        { field: "status", from: "pending", to: status },
        ...(reason ? [{ field: "rejectionReason", from: "", to: reason }] : []),
      ],
    });

    res.status(200).json({
      success: true,
      message: "Student status updated successfully",
    });
  } catch (err) {
    next(err);
    return;
  }
};

/**
 * Fire student (sets fired=true, firedAt=now, firedById) and marks status DROPOUT via model hook
 */
export const fireStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { firedById, reason } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid student id" });
      return;
    }
    if (firedById && !Types.ObjectId.isValid(firedById)) {
      res.status(400).json({ success: false, message: "Invalid firedById" });
      return;
    }

    const student = await Student.findById(id);
    if (!student) {
      res.status(404).json({ success: false, message: "Student not found" });
      return;
    }

    await student.markAsFired(
      firedById ? new Types.ObjectId(firedById) : new Types.ObjectId(),
      reason
    );

    res.status(200).json({
      success: true,
      message: "Student fired successfully",
      data: student,
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

/**
 * Re-join fired student (suggested name: reActivateFiredStudent)
 * Sets fired=false, clears firedAt/firedById, sets status ACTIVE
 */
export const reActivateFiredStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid student id" });
      return;
    }

    const student = await Student.findById(id);
    if (!student) {
      res.status(404).json({ success: false, message: "Student not found" });
      return;
    }

    student.fired = false;
    student.firedAt = undefined as any;
    (student as any).firedById = undefined;
    student.status = StudentStatus.ACTIVE;
    await student.save();

    res.status(200).json({
      success: true,
      message: "Student re-activated (status set to active)",
      data: student,
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};
