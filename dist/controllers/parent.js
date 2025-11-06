// src/controllers/parentController.ts
import { Parent, Student } from "@/models";
import { Types } from "mongoose";
// Shared pagination/search parser
function parseListQuery(q) {
    const page = Math.max(parseInt(String(q.page ?? "1"), 10), 1);
    const limit = Math.min(Math.max(parseInt(String(q.limit ?? "20"), 10), 1), 100);
    const skip = (page - 1) * limit;
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
 * Create Parent
 * Requires studentId to link to an existing Student (1:1 relation in your model)
 */
export const createParent = async (req, res, next) => {
    try {
        const { name, email, phone, nationalId, nationalIdImg, birthDate, gender, relationship, studentId, } = req.body;
        // Validate required fields including studentId
        if (!name || !phone || !nationalId || !nationalIdImg || !studentId) {
            res.status(400).json({
                success: false,
                message: "name, phone, nationalId, nationalIdImg, and studentId are required",
            });
            return;
        }
        // Validate ObjectId and ensure student exists
        if (!Types.ObjectId.isValid(studentId)) {
            res.status(400).json({ success: false, message: "Invalid studentId" });
            return;
        }
        const student = await Student.findById(studentId);
        if (!student) {
            res.status(404).json({ success: false, message: "Student not found" });
            return;
        }
        // Enforce 1:1: if another parent already linked to this student, block creation
        const existingForStudent = await Parent.findOne({ studentId });
        if (existingForStudent) {
            res.status(409).json({
                success: false,
                message: "Parent already exists for this student",
            });
            return;
        }
        const parent = await Parent.create({
            name,
            email,
            phone,
            nationalId,
            nationalIdImg,
            birthDate,
            gender,
            relationship,
            studentId,
        });
        res.status(201).json({
            success: true,
            message: "Parent created successfully",
            data: parent,
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
/**
 * Edit Parent (by parent id)
 */
export const updateParentById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid parent id" });
            return;
        }
        const { name, email, phone, nationalId, nationalIdImg, birthDate, gender, relationship, studentId, } = req.body;
        // Optional: allow re-linking to a different student, still validate constraints
        if (typeof studentId !== "undefined") {
            if (!Types.ObjectId.isValid(studentId)) {
                res.status(400).json({ success: false, message: "Invalid studentId" });
                return;
            }
            const student = await Student.findById(studentId);
            if (!student) {
                res.status(404).json({ success: false, message: "Student not found" });
                return;
            }
            // Ensure no other parent uses this studentId
            const conflict = await Parent.findOne({ studentId, _id: { $ne: id } });
            if (conflict) {
                res.status(409).json({
                    success: false,
                    message: "Another parent is already linked to this student",
                });
                return;
            }
        }
        const updated = await Parent.findByIdAndUpdate(id, {
            $set: {
                ...(typeof name !== "undefined" && { name }),
                ...(typeof email !== "undefined" && { email }),
                ...(typeof phone !== "undefined" && { phone }),
                ...(typeof nationalId !== "undefined" && { nationalId }),
                ...(typeof nationalIdImg !== "undefined" && { nationalIdImg }),
                ...(typeof birthDate !== "undefined" && { birthDate }),
                ...(typeof gender !== "undefined" && { gender }),
                ...(typeof relationship !== "undefined" && { relationship }),
                ...(typeof studentId !== "undefined" && { studentId }),
            },
        }, { new: true, runValidators: true, context: "query" });
        if (!updated) {
            res.status(404).json({ success: false, message: "Parent not found" });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Parent updated successfully",
            data: updated,
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
/**
 * Delete Parent (by parent id)
 */
export const deleteParentById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid parent id" });
            return;
        }
        const existing = await Parent.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, message: "Parent not found" });
            return;
        }
        await Parent.deleteOne({ _id: id });
        res.status(200).json({
            success: true,
            message: "Parent deleted successfully",
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
/**
 * Details by studentId (NOT by parentId)
 */
export const getParentByStudentId = async (req, res, next) => {
    try {
        const studentId = req.params.studentId;
        if (!Types.ObjectId.isValid(studentId)) {
            res.status(400).json({ success: false, message: "Invalid studentId" });
            return;
        }
        const parent = await Parent.findOne({ studentId }).populate("studentId");
        if (!parent) {
            res
                .status(404)
                .json({ success: false, message: "Parent not found for this student" });
            return;
        }
        res.status(200).json({
            success: true,
            data: parent,
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
/**
 * List Parents (pagination + search)
 */
export const listParents = async (req, res, next) => {
    try {
        const { page, limit, skip, filter, sort } = parseListQuery(req.query);
        // Optional filter: by studentId
        if (req.query.studentId &&
            Types.ObjectId.isValid(String(req.query.studentId))) {
            filter.studentId = new Types.ObjectId(String(req.query.studentId));
        }
        const [items, total] = await Promise.all([
            Parent.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate("studentId"),
            Parent.countDocuments(filter),
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
//# sourceMappingURL=parent.js.map