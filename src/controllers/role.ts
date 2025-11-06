// src/controllers/roleController.ts
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { Role, Permission, Admin } from "@/models";
import { env } from "@/env";

// Shared list parser (pagination, search, sorting)
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
    filter.$or = [{ name: { $regex: search, $options: "i" } }];
  }

  if (typeof q.isDefault !== "undefined") {
    const bool = String(q.isDefault).toLowerCase();
    if (bool === "true" || bool === "false") filter.isDefault = bool === "true";
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
 * Create Role
 * - name required
 * - unique by name (handled by unique index; map duplicate key errors globally)
 */
export const createRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, permissions } = req.body;

    const role = await Role.create({
      name,
      permissions: permissions.map((p: string) => new Types.ObjectId(p)),
    });

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: role,
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

/**
 * List Roles with pagination and search
 */
export const listRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit, skip, filter, sort } = parseListQuery(req.query);

    const [items, total] = await Promise.all([
      Role.find(filter).sort(sort).skip(skip).limit(limit),
      Role.countDocuments(filter),
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
export const listPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit, skip, filter, sort } = parseListQuery(req.query);

    const [items, total] = await Promise.all([
      Permission.find(filter).sort(sort).skip(skip).limit(limit),
      Permission.countDocuments(filter),
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
 * Edit Role by ID
 * - Updates name and/or isDefault
 * - If toggling to default, unset previous defaults (policy)
 */
export const updateRoleById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid role id" });
      return;
    }

    if (env.admin.roleId === id) {
      res.status(400).json({
        success: false,
        message: "Cannot delete or edit default role",
      });
      return;
    }

    const { name, permissions } = req.body;

    const updated = await Role.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(typeof name !== "undefined" && { name }),
          ...(typeof permissions !== "undefined" && { permissions }),
        },
      },
      { new: true, runValidators: true, context: "query" }
    );

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
  } catch (err) {
    next(err);
    return;
  }
};

/**
 * Delete Role by ID
 * - Prevent deleting if assigned to any admin (defensive guard, optional)
 * - Prevent deleting if isDefault (policy)
 */
export const deleteRoleById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    console.log("Delete Role", {
      id,
    });
    const existing = await Role.findById(id);
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
    const adminCount = await Admin.countDocuments({ roleId: id });
    if (adminCount > 0) {
      res.status(400).json({
        success: false,
        message: `Cannot delete role; ${adminCount} admin(s) assigned`,
      });
      return;
    }

    await Role.deleteOne({ _id: id });

    // Optional: clean up permissions referencing this role
    await Permission.deleteMany({ roleId: id });

    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};
