// src/controllers/branchController.ts
import { Branch } from "@/models";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

// Helpers
function parseListQuery(q: Request["query"]) {
  const page = Math.max(parseInt(String(q.page ?? "1"), 10), 1);
  const limit = Math.min(
    Math.max(parseInt(String(q.limit ?? "20"), 10), 1),
    100
  );
  const skip = (page - 1) * limit;

  const search = String(q.search ?? "").trim();
  const filter: Record<string, any> = {};

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
    if (bool === "true" || bool === "false") filter.isActive = bool === "true";
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
 * Create Branch
 */
export const createBranch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, address, phone, isActive } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: "name is required" });
      return;
    }

    // create
    const branch = await Branch.create({
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
  } catch (err) {
    next(err);
    return;
  }
};

/**
 * List Branches with pagination, search, and filters
 */
export const listBranches = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit, skip, filter, sort } = parseListQuery(req.query);

    const [items, total] = await Promise.all([
      Branch.find(filter).sort(sort).skip(skip).limit(limit),
      Branch.countDocuments(filter),
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
  } catch (err) {
    next(err);
    return;
  }
};

/**
 * Update Branch by ID
 */
export const updateBranchById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid branch id" });
      return;
    }

    const { name, address, phone, isActive } = req.body;

    const updated = await Branch.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(typeof name !== "undefined" && { name }),
          ...(typeof address !== "undefined" && { address }),
          ...(typeof phone !== "undefined" && { phone }),
          ...(typeof isActive !== "undefined" && { isActive }),
        },
      },
      { new: true, runValidators: true, context: "query" }
    );

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
  } catch (err) {
    next(err);
    return;
  }
};

/**
 * Delete Branch by ID
 * If you plan to soft-delete, replace with an update to isActive/isDeleted.
 */
export const deleteBranchById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid branch id" });
      return;
    }

    const existing = await Branch.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: "Branch not found" });
      return;
    }

    await Branch.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Branch deleted successfully",
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};
