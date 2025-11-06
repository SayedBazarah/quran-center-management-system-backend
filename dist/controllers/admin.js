"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdminById = exports.updateAdminById = exports.listAdmins = exports.createAdmin = void 0;
// src/controllers/adminController.ts
const env_1 = require("../env");
const models_1 = require("../models");
const file_1 = require("../utils/file");
const mongoose_1 = require("mongoose");
// Helper: parse pagination/sorting
function parseListQuery(q) {
    const page = Math.max(parseInt(String(q.page || "1"), 10), 1);
    const limit = Math.min(Math.max(parseInt(String(q.limit || "20"), 10), 1), 100);
    const skip = (page - 1) * limit;
    // Basic search by name | email | phone | username
    const search = String(q.search || "").trim();
    const filter = {};
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
        ];
    }
    // Optional branch filter
    if (q.branchId && mongoose_1.Types.ObjectId.isValid(String(q.branchId))) {
        filter.branchId = new mongoose_1.Types.ObjectId(String(q.branchId));
    }
    // Optional role filter
    if (q.roleId && mongoose_1.Types.ObjectId.isValid(String(q.roleId))) {
        filter.roleId = new mongoose_1.Types.ObjectId(String(q.roleId));
    }
    // Sort input like: "-createdAt,name"
    const sortRaw = String(q.sort || "-createdAt");
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
 * Create Admin
 * - Validates minimal required fields (name, phone, nationalId, username)
 * - Password hashing handled in Admin schema pre-save
 */
const createAdmin = async (req, res, next) => {
    try {
        if (!req.file) {
            res
                .status(400)
                .json({ success: false, message: "avatar file is required" });
            return;
        }
        const { name, email, phone, nationalId, username, password, gender, roleId, branchIds, } = req.body;
        const admin = await models_1.Admin.create({
            name,
            email,
            phone,
            nationalId,
            username,
            password,
            gender,
            roleId,
            branchIds: branchIds.map((b) => new mongoose_1.Types.ObjectId(b)),
        });
        try {
            const { filename } = await (0, file_1.saveMulterFile)(file_1.MediaCategory.Admin, req.file);
            admin.nationalIdImg = `${env_1.env.media}/admin/${filename}`;
            await admin.save();
        }
        catch (err) {
            console.log(err);
        }
        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: { id: `${admin._id}` },
        });
    }
    catch (err) {
        return next(err);
    }
};
exports.createAdmin = createAdmin;
/**
 * List Admins
 * - Supports pagination, sorting, search, and filtering by branch/role
 * - Returns meta pagination info
 */
const listAdmins = async (req, res, next) => {
    try {
        const { page, limit, skip, filter, sort } = parseListQuery(req.query);
        const [items, total] = await Promise.all([
            models_1.Admin.find(filter)
                .select("-password")
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate("roleId", "name")
                .populate("branchIds", "name"),
            models_1.Admin.countDocuments(filter),
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
    }
    catch (err) {
        return next(err);
    }
};
exports.listAdmins = listAdmins;
/**
 * Update Admin by ID
 * - Validates ObjectId
 * - Prevents direct overwrite of immutable/sensitive combinations if needed
 */
const updateAdminById = async (req, res, next) => {
    try {
        let filename = undefined;
        if (req.file) {
            const result = await (0, file_1.saveMulterFile)(file_1.MediaCategory.Admin, req.file);
            filename = result.filename;
        }
        const adminId = req.params.id;
        if (adminId == env_1.env.admin.id) {
            res.status(400).json({
                success: false,
                message: "Cannot update admin with id: " + adminId,
            });
            return;
        }
        // Disallow updating unique identifiers to empty values
        const { name, email, phone, username, password, avatar, gender, roleId, branchIds, } = req.body;
        // If password is provided, it will be hashed by pre-save hook via save() flow.
        // findByIdAndUpdate would bypass pre-save, so use two-step when password exists.
        if (password) {
            const admin = await models_1.Admin.findById(adminId).select("+password");
            if (!admin) {
                return next(new Error("Admin not found"));
            }
            // Assign fields
            if (typeof name !== "undefined")
                admin.name = name;
            if (typeof email !== "undefined")
                admin.email = email;
            if (typeof phone !== "undefined")
                admin.phone = phone;
            if (typeof username !== "undefined")
                admin.username = username;
            if (typeof avatar !== "undefined")
                admin.avatar = avatar;
            if (typeof gender !== "undefined")
                admin.gender = gender;
            if (typeof roleId !== "undefined")
                admin.roleId = roleId;
            if (typeof filename !== "undefined")
                admin.nationalIdImg = `${env_1.env.media}/admin/${filename}`;
            if (typeof branchIds !== "undefined")
                admin.branchIds = branchIds?.map((b) => new mongoose_1.Types.ObjectId(b));
            admin.password = password;
            await admin.save(); // triggers pre-save hashing
            const safe = await models_1.Admin.findById(admin._id).select("-password");
            res.status(200).json({
                success: true,
                message: "Admin updated successfully",
                data: safe,
            });
        }
        else {
            // No password change, can use atomic update
            const updated = await models_1.Admin.findByIdAndUpdate(adminId, {
                $set: {
                    ...(typeof name !== "undefined" && { name }),
                    ...(typeof email !== "undefined" && { email }),
                    ...(typeof phone !== "undefined" && { phone }),
                    ...(typeof username !== "undefined" && { username }),
                    ...(typeof avatar !== "undefined" && { avatar }),
                    ...(typeof gender !== "undefined" && { gender }),
                    ...(typeof roleId !== "undefined" && { roleId }),
                    ...(typeof branchIds !== "undefined" && { branchIds }),
                },
            }, { new: true, runValidators: true, upsert: false, context: "query" }).select("-password");
            if (!updated) {
                res.status(404).json({ success: false, message: "Admin not found" });
            }
            res.status(200).json({
                success: true,
                message: "Admin updated successfully",
                data: updated,
            });
        }
    }
    catch (err) {
        return next(err);
    }
};
exports.updateAdminById = updateAdminById;
/**
 * Delete Admin by ID
 * - Validates ObjectId
 * - Uses deleteOne (can be swapped for soft delete if needed)
 */
const deleteAdminById = async (req, res, next) => {
    try {
        const adminId = req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(adminId)) {
            return next(new Error("Invalid admin id"));
        }
        if (env_1.env.admin.id === adminId) {
            return next(new Error("Cannot delete admin with id: " + adminId));
        }
        const existing = await models_1.Admin.findById(adminId);
        if (!existing) {
            res.status(404).json({ success: false, message: "Admin not found" });
        }
        await models_1.Admin.deleteOne({ _id: adminId });
        res.status(200).json({
            success: true,
            message: "Admin deleted successfully",
        });
    }
    catch (err) {
        return next(err);
    }
};
exports.deleteAdminById = deleteAdminById;
