"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoleById = exports.updateRoleById = exports.listPermissions = exports.listRoles = exports.createRole = void 0;
const mongoose_1 = require("mongoose");
const models_1 = require("../models");
const env_1 = require("../env");
// Shared list parser (pagination, search, sorting)
function parseListQuery(q) {
    const page = Math.max(parseInt(String(q.page ?? "1"), 10), 1);
    const limit = Math.min(Math.max(parseInt(String(q.limit ?? "20"), 10), 1), 100);
    const skip = (page - 1) * limit;
    const search = String(q.search ?? "").trim();
    const filter = {};
    if (search) {
        filter.$or = [{ name: { $regex: search, $options: "i" } }];
    }
    if (typeof q.isDefault !== "undefined") {
        const bool = String(q.isDefault).toLowerCase();
        if (bool === "true" || bool === "false")
            filter.isDefault = bool === "true";
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
    console.log("Sort:", sort);
    return { page, limit, skip, filter, sort };
}
/**
 * Create Role
 * - name required
 * - unique by name (handled by unique index; map duplicate key errors globally)
 */
const createRole = async (req, res, next) => {
    try {
        const { name, permissions } = req.body;
        const role = await models_1.Role.create({
            name,
            permissions: permissions.map((p) => new mongoose_1.Types.ObjectId(p)),
        });
        res.status(201).json({
            success: true,
            message: "Role created successfully",
            data: role,
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.createRole = createRole;
/**
 * List Roles with pagination and search
 */
const listRoles = async (req, res, next) => {
    try {
        const { page, limit, skip, filter, sort } = parseListQuery(req.query);
        const [items, total] = await Promise.all([
            models_1.Role.find(filter).sort(sort).skip(skip).limit(limit),
            models_1.Role.countDocuments(filter),
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
exports.listRoles = listRoles;
const listPermissions = async (req, res, next) => {
    try {
        const { page, limit, skip, filter, sort } = parseListQuery(req.query);
        const [items, total] = await Promise.all([
            models_1.Permission.find(filter).sort(sort).skip(skip).limit(limit),
            models_1.Permission.countDocuments(filter),
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
exports.listPermissions = listPermissions;
/**
 * Edit Role by ID
 * - Updates name and/or isDefault
 * - If toggling to default, unset previous defaults (policy)
 */
const updateRoleById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid role id" });
            return;
        }
        if (env_1.env.admin.roleId === id) {
            res.status(400).json({
                success: false,
                message: "Cannot delete or edit default role",
            });
            return;
        }
        const { name, permissions } = req.body;
        const updated = await models_1.Role.findByIdAndUpdate(id, {
            $set: {
                ...(typeof name !== "undefined" && { name }),
                ...(typeof permissions !== "undefined" && { permissions }),
            },
        }, { new: true, runValidators: true, context: "query" });
        if (!updated) {
            res.status(404).json({ success: false, message: "Role not found" });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Role updated successfully",
            data: updated,
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.updateRoleById = updateRoleById;
/**
 * Delete Role by ID
 * - Prevent deleting if assigned to any admin (defensive guard, optional)
 * - Prevent deleting if isDefault (policy)
 */
const deleteRoleById = async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log("Delete Role", {
            id,
        });
        const existing = await models_1.Role.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, message: "Role not found" });
            return;
        }
        if (existing.isDefault) {
            res
                .status(400)
                .json({ success: false, message: "Cannot delete default role" });
            return;
        }
        // Optional: check if any Admin currently references this role
        // Using populate-free count for performance
        const adminCount = await models_1.Admin.countDocuments({ roleId: id });
        if (adminCount > 0) {
            res.status(400).json({
                success: false,
                message: `Cannot delete role; ${adminCount} admin(s) assigned`,
            });
            return;
        }
        await models_1.Role.deleteOne({ _id: id });
        // Optional: clean up permissions referencing this role
        await models_1.Permission.deleteMany({ roleId: id });
        res.status(200).json({
            success: true,
            message: "Role deleted successfully",
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.deleteRoleById = deleteRoleById;
