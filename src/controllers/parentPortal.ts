import { Parent, Student, Enrollment } from "@/models";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

/**
 * Public route: Get student data by studentId (used by QR code link)
 * No authentication required
 */
export const getStudentForParentPortal = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { studentId } = req.params;

    if (!Types.ObjectId.isValid(studentId)) {
      res.status(400).json({ success: false, message: "معرف الطالب غير صحيح" });
      return;
    }

    const student = await Student.findById(studentId)
      .populate("branchId", "name address")
      .select("name status gender branchId createdAt parentNote");

    if (!student) {
      res.status(404).json({ success: false, message: "لم يتم العثور على الطالب" });
      return;
    }

    const [enrollments, parent] = await Promise.all([
      Enrollment.find({ studentId })
        .populate("courseId", "name description duration")
        .populate("teacherId", "name phone")
        .sort({ startDate: -1 }),
      Parent.findOne({ studentId }).select("name relationship"),
    ]);

    res.status(200).json({
      success: true,
      data: { student, parent, enrollments },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Public route: Parent looks up their child's info using phone + nationalId
 * No authentication required
 */
export const lookupParentPortal = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { phone, nationalId } = req.body;

    if (!phone || !nationalId) {
      res.status(400).json({
        success: false,
        message: "رقم الهاتف والرقم القومي مطلوبان",
      });
      return;
    }

    // Find parent by phone and nationalId
    const parent = await Parent.findOne({
      phone: String(phone).trim(),
      nationalId: String(nationalId).trim(),
    }).populate({
      path: "studentId",
      populate: { path: "branchId", select: "name address" },
    });

    if (!parent) {
      res.status(404).json({
        success: false,
        message: "لم يتم العثور على ولي الأمر بهذه البيانات",
      });
      return;
    }

    if (!parent.studentId) {
      res.status(404).json({
        success: false,
        message: "لا يوجد طالب مرتبط بهذا الحساب",
      });
      return;
    }

    const student = parent.studentId as any;
    const studentId = student._id || student;

    // Fetch enrollments with course and teacher details
    const enrollments = await Enrollment.find({ studentId })
      .populate("courseId", "name description duration")
      .populate("teacherId", "name phone")
      .sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      data: {
        parent: {
          name: parent.name,
          relationship: parent.relationship,
        },
        student,
        enrollments,
      },
    });
  } catch (err) {
    next(err);
  }
};
