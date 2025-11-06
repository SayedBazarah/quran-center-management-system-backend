"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnrollmentLog = exports.closeEnrollmentAsGraduated = exports.rejectEnrollment = exports.enrollmentStatus = exports.listLateEnrollments = exports.listPendingEnrollments = exports.listEnrollmentsByStudent = exports.deleteEnrollmentById = exports.updateEnrollmentById = exports.createEnrollment = void 0;
const mongoose_1 = require("mongoose");
const models_1 = require("../models");
const enums_1 = require("../types/enums");
const log_1 = require("../models/log");
// Shared pagination + search + sorting
function parseListQuery(q) {
    const page = Math.max(parseInt(String(q.page ?? "1"), 10), 1);
    const limit = Math.min(Math.max(parseInt(String(q.limit ?? "20"), 10), 1), 100);
    const skip = (page - 1) * limit;
    const search = String(q.search ?? "").trim();
    const filter = {};
    if (search) {
        filter.$or = [{ note: { $regex: search, $options: "i" } }]; // if you add notes at enrollment-level
    }
    // optional filters
    if (q.status)
        filter.status = String(q.status);
    if (q.courseId && mongoose_1.Types.ObjectId.isValid(String(q.courseId))) {
        filter.courseId = new mongoose_1.Types.ObjectId(String(q.courseId));
    }
    if (q.teacherId && mongoose_1.Types.ObjectId.isValid(String(q.teacherId))) {
        filter.teacherId = new mongoose_1.Types.ObjectId(String(q.teacherId));
    }
    if (q.adminId && mongoose_1.Types.ObjectId.isValid(String(q.adminId))) {
        filter.adminId = new mongoose_1.Types.ObjectId(String(q.adminId));
    }
    const sortRaw = String(q.sort ?? "-createdAt");
    const sort = {};
    sortRaw.split(",").forEach((token) => {
        const t = token.trim();
        if (!t)
            return;
        if (t.startsWith("-"))
            sort[t.slice(1)] = -1;
        else
            sort[t] = 1;
    });
    return { page, limit, skip, filter, sort };
}
/**
 * Create Enrollment
 * Required: courseId, studentId, optional: teacherId, adminId, startDate/endDate
 * Enforces: course, student, and (if provided) teacher/admin must exist
 */
const createEnrollment = async (req, res, next) => {
    try {
        const studentId = req.params.studentId;
        const { courseId, startDate, teacherId, adminId } = req.body;
        // Existence checks
        const [course, student, teacher, admin, activeEnrollment, alreadyEnrolled] = await Promise.all([
            models_1.Course.findById(courseId),
            models_1.Student.findById(studentId),
            models_1.Teacher.findById(teacherId),
            models_1.Admin.findById(adminId),
            models_1.Enrollment.findOne({
                studentId,
                status: {
                    $in: [
                        enums_1.EnrollmentStatus.PENDING,
                        enums_1.EnrollmentStatus.ACTIVE,
                        enums_1.EnrollmentStatus.LATE,
                    ],
                },
            }),
            models_1.Enrollment.findOne({
                studentId,
                courseId,
            }),
        ]);
        if (!course) {
            res.status(404).json({ success: false, message: "المرحلة غير موجودة" });
            return;
        }
        if (!student) {
            res.status(404).json({ success: false, message: "الطالب غير موجود" });
            return;
        }
        if (student.status !== enums_1.StudentStatus.ACTIVE) {
            res.status(400).json({
                success: false,
                message: "يجب أن يكون الطالب يدرس، وليس اي حالة اخري لتسجيل في مرحلة جديدة",
            });
            return;
        }
        if (!teacher) {
            res.status(404).json({ success: false, message: "المعلم غير موجود" });
            return;
        }
        if (!admin) {
            res.status(404).json({ success: false, message: "المدير غير موجود" });
            return;
        }
        if (alreadyEnrolled &&
            alreadyEnrolled.status !== enums_1.EnrollmentStatus.REJECTED) {
            res.status(400).json({
                success: false,
                message: "الطالب سجل بالفعل في هذه المرحلة",
            });
            return;
        }
        if (activeEnrollment) {
            res.status(400).json({
                success: false,
                message: "الطالب لدية مرحلة لم ينتهي منها بعد",
            });
            return;
        }
        // One student per course unique pair is enforced by index in model; catch E11000 globally
        const enrollment = await models_1.Enrollment.create({
            status: enums_1.EnrollmentStatus.PENDING,
            startDate: startDate ? new Date(startDate) : new Date(),
            courseId,
            studentId,
            teacherId,
            adminId,
            createdBy: req.user?.id,
        });
        await models_1.Log.create({
            action: log_1.LogAction.ENROLL,
            studentId: student._id,
            enrollmentId: enrollment._id,
            adminId: new mongoose_1.Types.ObjectId(`${req.user?.id}`),
            note: `تم تسجيل الطالب بمرحلة ${course.name} بواسطة ${req.user?.name}`,
        });
        res.status(201).json({
            success: true,
            message: "تم تسجيل الطالب بمرحلة جديدة",
            data: enrollment,
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.createEnrollment = createEnrollment;
/**
 * Edit Enrollment (by id)
 * Allows updating status, dates, and relations (with validation)
 */
const updateEnrollmentById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { teacherId, adminId, status } = req.body;
        // Optional existence checks
        const checks = [];
        if (teacherId)
            checks.push(models_1.Teacher.findById(teacherId));
        if (adminId)
            checks.push(models_1.Admin.findById(adminId));
        const existence = await Promise.all(checks);
        if (existence.includes(null)) {
            res
                .status(404)
                .json({ success: false, message: "Related document not found" });
            return;
        }
        const original = await models_1.Enrollment.findById(id)
            .populate({
            path: "teacherId",
            select: "_id name",
        })
            .populate({
            path: "adminId",
            select: "_id name",
        })
            .populate({
            path: "studentId",
            select: "name",
        });
        if (!original) {
            res.status(404).json({ success: false, message: "Enrollment not found" });
            return;
        }
        const updated = await models_1.Enrollment.findByIdAndUpdate(id, {
            $set: {
                ...(typeof teacherId !== "undefined" && { teacherId }),
                ...(typeof adminId !== "undefined" && { adminId }),
                ...(typeof status !== "undefined" && { status }),
            },
        }, { new: true, runValidators: true, context: "query" })
            .populate({
            path: "teacherId",
            select: "_id name",
        })
            .populate({
            path: "adminId",
            select: "_id name",
        });
        if (!updated) {
            res.status(404).json({ success: false, message: "Enrollment not found" });
            return;
        }
        await models_1.Log.create({
            action: log_1.LogAction.UPDATE,
            studentId: updated.studentId,
            enrollmentId: updated._id,
            adminId: new mongoose_1.Types.ObjectId(`${req.user?.id}`),
            note: `تم تعديل بيانات الطالب ${original.studentId?.name} بواسطة المشرف  ${req.user?.name}، 
      ${(updated?.status !== original?.status &&
                "تم تغير حالة المرحلة من " +
                    (0, enums_1.getEnumValues)(enums_1.EnrollmentStatus)[(0, enums_1.getEnumValues)(enums_1.EnrollmentStatus).indexOf(original.status)] +
                    " إلى " +
                    (0, enums_1.getEnumValues)(enums_1.EnrollmentStatus)[(0, enums_1.getEnumValues)(enums_1.EnrollmentStatus).indexOf(updated.status)]) ||
                ""}
      ${(updated?.teacherId?.id !== original?.teacherId?.id &&
                "تم تغير المعلم من " +
                    original?.teacherId?.name +
                    " إلى " +
                    updated?.teacherId?.name) ||
                ""}
      ${(updated?.adminId?.id !== original?.adminId?.id &&
                "تم تغير بيانات مشرف الدورة من " +
                    original?.adminId?.name +
                    " إلى " +
                    updated?.adminId?.name) ||
                ""}
      `,
        });
        res.status(200).json({
            success: true,
            message: "Enrollment updated successfully",
            data: updated,
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.updateEnrollmentById = updateEnrollmentById;
/**
 * Delete Enrollment (by id)
 */
const deleteEnrollmentById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res
                .status(400)
                .json({ success: false, message: "Invalid enrollment id" });
            return;
        }
        const existing = await models_1.Enrollment.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, message: "Enrollment not found" });
            return;
        }
        await models_1.Enrollment.deleteOne({ _id: id });
        res.status(200).json({
            success: true,
            message: "Enrollment deleted successfully",
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.deleteEnrollmentById = deleteEnrollmentById;
/**
 * List all Enrollments for a Student by studentId
 */
const listEnrollmentsByStudent = async (req, res, next) => {
    try {
        const studentId = req.params.studentId;
        if (!mongoose_1.Types.ObjectId.isValid(studentId)) {
            res.status(400).json({ success: false, message: "Invalid studentId" });
            return;
        }
        const { page, limit, skip, sort } = parseListQuery(req.query);
        const filter = { studentId: new mongoose_1.Types.ObjectId(studentId) };
        const [items, total] = await Promise.all([
            models_1.Enrollment.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate({ path: "teacherId", select: "_id name" })
                .populate({ path: "adminId", select: "_id name" })
                .populate({ path: "courseId", select: "_id name" })
                .populate({ path: "createdBy", select: "_id name" })
                .populate({
                path: "acceptedBy",
                select: "_id name",
            })
                .populate({
                path: "logs",
                select: "_id action note changes createdAt adminId enrollmentId",
                options: { sort: { createdAt: -1 } }, // newest first
                populate: { path: "adminId", select: "_id name" },
            })
                .populate({ path: "rejectedBy", select: "_id name" }),
            models_1.Enrollment.countDocuments(filter),
        ]);
        res.status(200).json({
            success: true,
            data: items,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.listEnrollmentsByStudent = listEnrollmentsByStudent;
/**
 * List all pending Enrollments (require admin accept)
 */
const listPendingEnrollments = async (req, res, next) => {
    try {
        const { page, limit, skip, sort } = parseListQuery(req.query);
        const filter = { status: enums_1.EnrollmentStatus.PENDING };
        const [items, total] = await Promise.all([
            models_1.Enrollment.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate({
                path: "courseId",
                select: "name",
            })
                .populate({
                path: "studentId",
                select: "name phone",
            })
                .populate({ path: "teacherId", select: "name" })
                .populate({ path: "adminId", select: "name" })
                .populate({ path: "createdBy", select: "name" }),
            models_1.Enrollment.countDocuments(filter),
        ]);
        res.status(200).json({
            success: true,
            data: items,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.listPendingEnrollments = listPendingEnrollments;
// List enrollments that are late (endDate < today, status can be anything)
// Optional filters supported via query: courseId, teacherId, adminId, studentId
const listLateEnrollments = async (req, res, next) => {
    try {
        // Compute "start of today" in server timezone to avoid partial-day mismatches
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        // Reuse generic list parser for pagination + sorting
        const { page, limit, skip, sort } = (function parse(q) {
            const page = Math.max(parseInt(String(q.page ?? "1"), 10), 1);
            const limit = Math.min(Math.max(parseInt(String(q.limit ?? "20"), 10), 1), 100);
            const skip = (page - 1) * limit;
            const sortRaw = String(q.sort ?? "-endDate"); // default most overdue first
            const sort = {};
            sortRaw.split(",").forEach((token) => {
                const t = token.trim();
                if (!t)
                    return;
                if (t.startsWith("-"))
                    sort[t.slice(1)] = -1;
                else
                    sort[t] = 1;
            });
            return { page, limit, skip, sort };
        })(req.query);
        // Build filter: endDate < startOfToday
        const filter = { endDate: { $lt: startOfToday } };
        // Optional filters by ids
        const { courseId, teacherId, adminId, studentId } = req.query;
        if (courseId && mongoose_1.Types.ObjectId.isValid(String(courseId))) {
            filter.courseId = new mongoose_1.Types.ObjectId(String(courseId));
        }
        if (teacherId && mongoose_1.Types.ObjectId.isValid(String(teacherId))) {
            filter.teacherId = new mongoose_1.Types.ObjectId(String(teacherId));
        }
        if (adminId && mongoose_1.Types.ObjectId.isValid(String(adminId))) {
            filter.adminId = new mongoose_1.Types.ObjectId(String(adminId));
        }
        if (studentId && mongoose_1.Types.ObjectId.isValid(String(studentId))) {
            filter.studentId = new mongoose_1.Types.ObjectId(String(studentId));
        }
        const [items, total] = await Promise.all([
            models_1.Enrollment.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate("courseId")
                .populate("studentId")
                .populate("teacherId")
                .populate("adminId"),
            models_1.Enrollment.countDocuments(filter),
        ]);
        res.status(200).json({
            success: true,
            data: items,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.listLateEnrollments = listLateEnrollments;
/**
 * Accept Enrollment (status -> active)
 */
const enrollmentStatus = async (req, res, next) => {
    try {
        const enrollmentId = req.params.enrollmentId;
        const { status, reason } = req.body;
        const enrollment = await models_1.Enrollment.findById(enrollmentId).populate({
            path: "studentId",
            select: "name",
        });
        if (!enrollment) {
            res.status(404).json({ success: false, message: "Enrollment not found" });
            return;
        }
        if (status === enums_1.EnrollmentStatus.ACTIVE) {
            enrollment.status = enums_1.EnrollmentStatus.ACTIVE;
            enrollment.acceptedBy = new mongoose_1.Types.ObjectId(`${req.user?.id}`);
            enrollment.acceptedAt = new Date();
        }
        else if (status === enums_1.EnrollmentStatus.REJECTED) {
            enrollment.status = enums_1.EnrollmentStatus.REJECTED;
            enrollment.rejectedBy = new mongoose_1.Types.ObjectId(`${req.user?.id}`);
            enrollment.rejectionReason = reason;
            enrollment.rejectedAt = new Date();
        }
        await enrollment.save();
        await models_1.Log.create({
            action: log_1.LogAction.ENROLL,
            studentId: enrollment.studentId?.id,
            enrollmentId: enrollment._id,
            adminId: new mongoose_1.Types.ObjectId(`${req.user?.id}`),
            note: (status === enums_1.EnrollmentStatus.ACTIVE &&
                `تم قبول الدورة لطالب ${enrollment.studentId?.name} بواسطة ${req.user?.name}`) ||
                (status === enums_1.EnrollmentStatus.REJECTED &&
                    `تم رفض الدورة لمشرف ${enrollment.studentId?.name} بواسطة ${req.user?.name} بسبب ${reason}`),
        });
        res.status(200).json({
            success: true,
            message: "Enrollment accepted (status set to active)",
            data: enrollment,
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.enrollmentStatus = enrollmentStatus;
/**
 * Reject Enrollment (status -> dropout, set endDate now)
 */
const rejectEnrollment = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res
                .status(400)
                .json({ success: false, message: "Invalid enrollment id" });
            return;
        }
        const enrollment = await models_1.Enrollment.findById(id);
        if (!enrollment) {
            res.status(404).json({ success: false, message: "Enrollment not found" });
            return;
        }
        enrollment.status = enums_1.EnrollmentStatus.DROPOUT;
        enrollment.endDate = new Date();
        await enrollment.save();
        res.status(200).json({
            success: true,
            message: "Enrollment rejected (status set to dropout)",
            data: enrollment,
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.rejectEnrollment = rejectEnrollment;
/**
 * Close Enrollment as Graduated (status -> end + set student.graduated + status GRADUATED)
 * If you prefer: set status to END and also mark student as graduated
 */
const closeEnrollmentAsGraduated = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res
                .status(400)
                .json({ success: false, message: "Invalid enrollment id" });
            return;
        }
        const enrollment = await models_1.Enrollment.findById(id);
        if (!enrollment) {
            res.status(404).json({ success: false, message: "Enrollment not found" });
            return;
        }
        // Close enrollment
        enrollment.status = enums_1.EnrollmentStatus.GRADUATED;
        enrollment.endDate = new Date();
        await enrollment.save();
        // Mark student as graduated via method on Student model (if present)
        // or set fields directly:
        const student = await models_1.Student.findById(enrollment.studentId);
        if (student) {
            student.graduated = new Date();
            // status auto-updates to GRADUATED in Student pre-save, per earlier model
            await student.save();
        }
        res.status(200).json({
            success: true,
            message: "Enrollment closed and student marked as graduated",
            data: enrollment,
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.closeEnrollmentAsGraduated = closeEnrollmentAsGraduated;
const createEnrollmentLog = async (req, res, next) => {
    try {
        const studentId = req.params.studentId;
        const enrollmentId = req.params.enrollmentId;
        const { note } = req.body;
        const log = await models_1.Log.create({
            studentId: new mongoose_1.Types.ObjectId(studentId),
            enrollmentId: new mongoose_1.Types.ObjectId(enrollmentId),
            note,
            action: log_1.LogAction.ENROLL,
            adminId: new mongoose_1.Types.ObjectId(`${req.user?.id}`),
        });
        res.status(201).json({
            success: true,
            message: "Enrollment log created successfully",
            data: log,
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.createEnrollmentLog = createEnrollmentLog;
