"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBranchById = exports.updateBranchById = exports.listBranches = exports.createBranch = void 0;
// src/controllers/branchController.ts
const models_1 = require("../models");
const mongoose_1 = require("mongoose");
// Helpers
function parseListQuery(q) {
    const page = Math.max(parseInt(String(q.page ?? "1"), 10), 1);
    const limit = Math.min(Math.max(parseInt(String(q.limit ?? "20"), 10), 1), 100);
    const skip = (page - 1) * limit;
    const search = String(q.search ?? "").trim();
    const filter = {};
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { address: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
        ];
    }
    if (typeof q.isActive !== "undefined") {
        // accept "true"/"false"
        const bool = String(q.isActive).toLowerCase();
        if (bool === "true" || bool === "false")
            filter.isActive = bool === "true";
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
 * Create Branch
 */
const createBranch = async (req, res, next) => {
    try {
        const { name, address, phone, isActive } = req.body;
        if (!name) {
            res.status(400).json({ success: false, message: "name is required" });
            return;
        }
        // create
        const branch = await models_1.Branch.create({
            name,
            address,
            phone,
            isActive,
        });
        res.status(201).json({
            success: true,
            message: "Branch created successfully",
            data: branch,
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.createBranch = createBranch;
/**
 * List Branches with pagination, search, and filters
 */
const listBranches = async (req, res, next) => {
    try {
        const { page, limit, skip, filter, sort } = parseListQuery(req.query);
        const [items, total] = await Promise.all([
            models_1.Branch.find(filter).sort(sort).skip(skip).limit(limit),
            models_1.Branch.countDocuments(filter),
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
exports.listBranches = listBranches;
/**
 * Update Branch by ID
 */
const updateBranchById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid branch id" });
            return;
        }
        const { name, address, phone, isActive } = req.body;
        const updated = await models_1.Branch.findByIdAndUpdate(id, {
            $set: {
                ...(typeof name !== "undefined" && { name }),
                ...(typeof address !== "undefined" && { address }),
                ...(typeof phone !== "undefined" && { phone }),
                ...(typeof isActive !== "undefined" && { isActive }),
            },
        }, { new: true, runValidators: true, context: "query" });
        if (!updated) {
            res.status(404).json({ success: false, message: "Branch not found" });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Branch updated successfully",
            data: updated,
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.updateBranchById = updateBranchById;
/**
 * Delete Branch by ID
 * If you plan to soft-delete, replace with an update to isActive/isDeleted.
 */
const deleteBranchById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid branch id" });
            return;
        }
        const existing = await models_1.Branch.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, message: "Branch not found" });
            return;
        }
        await models_1.Branch.deleteOne({ _id: id });
        res.status(200).json({
            success: true,
            message: "Branch deleted successfully",
        });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
};
exports.deleteBranchById = deleteBranchById;
