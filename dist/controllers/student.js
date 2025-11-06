"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reActivateFiredStudent = exports.fireStudent = exports.updateStudentStatus = exports.acceptStudent = exports.listPendingStudents = exports.listStudentsWithEnrollment = exports.listStudents = exports.getStudentDetails = exports.deleteStudentById = exports.updateStudentById = exports.createStudent = void 0;
const mongoose_1 = require("mongoose");
const models_1 = require("../models");
const enums_1 = require("../types/enums");
const file_1 = require("../utils/file");
const env_1 = require("../env");
// Shared list parser with pagination, search, sorting
function parseListQuery(q) {
    // Check if requesting all students
    const returnAll = q.all === "true" || q.limit === "all";
    const page = returnAll ? 1 : Math.max(parseInt(String(q.page ?? "1"), 10), 1);
    const limit = returnAll
        ? 0 // 0 means no limit in MongoDB
        : Math.min(Math.max(parseInt(String(q.limit ?? "20"), 10), 1), 100);
    const skip = returnAll ? 0 : (page - 1) * limit;
    const search = String(q.search ?? "").trim();
    const filter = {};
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { nationalId: { $regex: search, $options: "i" } },
        ];
    }
    if (q.branchId && mongoose_1.Types.ObjectId.isValid(String(q.branchId))) {
        filter.branchId = new mongoose_1.Types.ObjectId(String(q.branchId));
    }
    if (q.status &&
        Object.values(enums_1.StudentStatus).includes(String(q.status))) {
        filter.status = String(q.status);
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
 * Create Student
 * Required: name, phone, nationalId
 */
const createStudent = async (req, res, next) => {
    try {
        const { name, email, phone, nationalId, birthDate, gender, address, branchId, adminId, // creator admin (optional trace)
         } = req.body;
        if (!req.file) {
            res.status(400).json({ success: false, message: "No file uploaded" });
            return;
        }
        if (branchId && !mongoose_1.Types.ObjectId.isValid(branchId)) {
            res.status(400).json({ success: false, message: "Invalid branchId" });
            return;
        }
        if (adminId && !mongoose_1.Types.ObjectId.isValid(adminId)) {
            res.status(400).json({ success: false, message: "Invalid adminId" });
            return;
        }
        if (adminId) {
            const admin = await models_1.Admin.findById(adminId);
            if (!admin) {
                res.status(404).json({ success: false, message: "Admin not found" });
                return;
            }
        }
        const { filename } = await (0, file_1.saveMulterFile)(file_1.MediaCategory.Student, req.file);
        const student = await models_1.Student.create({
            name,
            email,
            phone,
            nationalId,
            birthDate,
            gender,
            address,
            branchId,
            adminId,
            status: enums_1.StudentStatus.PENDING,
            createdBy: req.user?.id,
            nationalIdImg: `${env_1.env.media}/${file_1.MediaCategory.Student}/${filename}`,
        });
        await models_1.Log.create({
            studentId: student._id,
            adminId: new mongoose_1.Types.ObjectId(`${req.user?.id}`),
            note: `تم تسجيل بيانات الطالب بواسطة  ${req.user?.name}`,
        });
        res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: student,
        });
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.createStudent = createStudent;
/**
 * Edit Student by ID
 */
const updateStudentById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid student id" });
            return;
        }
        const { name, email, phone, nationalId, nationalIdImg, avatar, birthDate, gender, address, branchId, status, acceptedById, // optional update
         } = req.body;
        if (branchId && !mongoose_1.Types.ObjectId.isValid(branchId)) {
            res.status(400).json({ success: false, message: "Invalid branchId" });
            return;
        }
        if (acceptedById && !mongoose_1.Types.ObjectId.isValid(acceptedById)) {
            res.status(400).json({ success: false, message: "Invalid acceptedById" });
            return;
        }
        const updated = await models_1.Student.findByIdAndUpdate(id, {
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
        }, { new: false, runValidators: true, context: "query" });
        await models_1.Log.create({
            studentId: id,
            adminId: new mongoose_1.Types.ObjectId(`${req.user?.id}`),
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
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.updateStudentById = updateStudentById;
/**
 * Delete Student by ID
 */
const deleteStudentById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid student id" });
            return;
        }
        const existing = await models_1.Student.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, message: "Student not found" });
            return;
        }
        await models_1.Student.deleteOne({ _id: id });
        res.status(200).json({
            success: true,
            message: "Student deleted successfully",
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.deleteStudentById = deleteStudentById;
/**
 * Student details by ID
 * Includes aggregated current enrollments count (optional), you can expand as needed
 */
const getStudentDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid student id" });
            return;
        }
        const student = await models_1.Student.findById(id).populate("branchId parentId adminId acceptedById firedById");
        if (!student) {
            res.status(404).json({ success: false, message: "Student not found" });
            return;
        }
        res.status(200).json({
            success: true,
            data: student,
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.getStudentDetails = getStudentDetails;
/**
 * List students with enrollment summary:
 * Return students plus latest enrollment for each student (startDate, endDate, course name)
 * You can also add a query param latest=true to restrict to latest enrollment only.
 */
const listStudents = async (req, res, next) => {
    try {
        const { page, limit, skip, filter, sort } = parseListQuery(req.query);
        const [items, total] = await Promise.all([
            models_1.Student.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate({
                path: "adminId",
                populate: {
                    path: "name",
                },
            }),
            models_1.Student.countDocuments(filter),
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
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.listStudents = listStudents;
const listStudentsWithEnrollment = async (req, res, next) => {
    try {
        const { page, limit, skip, filter, sort } = parseListQuery(req.query);
        // const latestOnly =
        //   String(req.query.latest ?? "true").toLowerCase() === "true";
        const adminBranchIds = req.user?.branchIds || [];
        if (!adminBranchIds.length) {
            res.status(403).json({ success: false, message: "No branch access" });
            return;
        }
        const newFilter = {
            ...filter,
            branchId: { $in: adminBranchIds.map((id) => new mongoose_1.Types.ObjectId(id)) },
        };
        // Base students page
        const students = await models_1.Student.find(newFilter)
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
        const total = await models_1.Student.countDocuments(filter);
        // For each student, fetch latest enrollment and course name
        const studentIds = students.map((s) => s._id);
        // 1) Active (current) enrollment per student
        const active = await models_1.Enrollment.find({
            studentId: { $in: studentIds },
            status: {
                $in: [
                    enums_1.EnrollmentStatus.ACTIVE,
                    enums_1.EnrollmentStatus.LATE,
                    enums_1.EnrollmentStatus.PENDING,
                ],
            },
        })
            .select("studentId startDate status courseId teacherId")
            .populate({ path: "courseId", select: "name _id id duration" })
            .populate({ path: "teacherId", select: "name _id id" })
            .lean();
        const activeMap = new Map();
        for (const e of active) {
            const sid = String(e.studentId);
            const prev = activeMap.get(sid);
            if (!prev || e.createdAt > prev.createdAt)
                activeMap.set(sid, e);
        }
        // 2) All enrollments per student (optionally limit N most recent)
        const all = await models_1.Enrollment.find({ studentId: { $in: studentIds } })
            .sort({ createdAt: -1 })
            .select("studentId status courseId teacherId")
            .populate({ path: "courseId", select: "name _id duration" })
            .populate({ path: "teacherId", select: "name _id" })
            .lean();
        const allMap = new Map();
        for (const e of all) {
            const sid = String(e.studentId);
            if (!allMap.has(sid))
                allMap.set(sid, []);
            allMap.get(sid).push(e);
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
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.listStudentsWithEnrollment = listStudentsWithEnrollment;
/**
 * List all pending students (waiting to be accepted)
 */
const listPendingStudents = async (req, res, next) => {
    try {
        const { page, limit, skip, sort } = parseListQuery(req.query);
        const filter = { status: enums_1.StudentStatus.PENDING };
        const [items, total] = await Promise.all([
            models_1.Student.find(filter)
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
            models_1.Student.countDocuments(filter),
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
exports.listPendingStudents = listPendingStudents;
/**
 * Accept student (status -> active; set acceptedById)
 */
const acceptStudent = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid student id" });
            return;
        }
        const student = await models_1.Student.findById(id);
        if (!student) {
            res.status(404).json({ success: false, message: "Student not found" });
            return;
        }
        student.status = enums_1.StudentStatus.ACTIVE;
        student.acceptedById = new mongoose_1.Types.ObjectId(`${req.user?.id}`);
        await student.save();
        await models_1.Log.create({
            studentId: student._id,
            adminId: new mongoose_1.Types.ObjectId(`${req.user?.id}`),
            note: `تم قبول التحاق الطالب بالمركز بواسطة ${req.user?.name}`,
        });
        res.status(200).json({
            success: true,
            message: "Student accepted (status set to active)",
            data: student,
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.acceptStudent = acceptStudent;
/**
 * Reject student (status -> dropout)
 */
const updateStudentStatus = async (req, res, next) => {
    try {
        console.log("--- Update student status ----");
        const { id } = req.params;
        const { status, reason } = req.body;
        const update = { status };
        const now = new Date();
        if (status === enums_1.StudentStatus.ACTIVE) {
            update.status = enums_1.StudentStatus.ACTIVE;
            update.acceptedById = req.user?.id;
            update.acceptedAt = now;
        }
        else if (status === enums_1.StudentStatus.REJECTED) {
            update.status = enums_1.StudentStatus.REJECTED;
            update.rejectedById = req.user?.id;
            update.rejectionReason = reason;
            update.rejectedAt = now;
        }
        const updated = await models_1.Student.findOneAndUpdate({ _id: id, status: { $in: ["pending", status] } }, // simple transition guard
        { $set: update }, { new: true, runValidators: true, context: "query" });
        if (!updated) {
            res.status(404).json({
                success: false,
                message: "Student not found or invalid transition",
            });
            return;
        }
        await models_1.Log.create({
            studentId: id,
            adminId: req.user?.id,
            note: status === "accepted"
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
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.updateStudentStatus = updateStudentStatus;
/**
 * Fire student (sets fired=true, firedAt=now, firedById) and marks status DROPOUT via model hook
 */
const fireStudent = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { firedById, reason } = req.body;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid student id" });
            return;
        }
        if (firedById && !mongoose_1.Types.ObjectId.isValid(firedById)) {
            res.status(400).json({ success: false, message: "Invalid firedById" });
            return;
        }
        const student = await models_1.Student.findById(id);
        if (!student) {
            res.status(404).json({ success: false, message: "Student not found" });
            return;
        }
        await student.markAsFired(firedById ? new mongoose_1.Types.ObjectId(firedById) : new mongoose_1.Types.ObjectId(), reason);
        res.status(200).json({
            success: true,
            message: "Student fired successfully",
            data: student,
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.fireStudent = fireStudent;
/**
 * Re-join fired student (suggested name: reActivateFiredStudent)
 * Sets fired=false, clears firedAt/firedById, sets status ACTIVE
 */
const reActivateFiredStudent = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid student id" });
            return;
        }
        const student = await models_1.Student.findById(id);
        if (!student) {
            res.status(404).json({ success: false, message: "Student not found" });
            return;
        }
        student.fired = false;
        student.firedAt = undefined;
        student.firedById = undefined;
        student.status = enums_1.StudentStatus.ACTIVE;
        await student.save();
        res.status(200).json({
            success: true,
            message: "Student re-activated (status set to active)",
            data: student,
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.reActivateFiredStudent = reActivateFiredStudent;
