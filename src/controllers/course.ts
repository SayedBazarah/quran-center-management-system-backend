// src/controllers/courseController.ts
import { Course } from "@/models";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

// Parse pagination, search, and sorting
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
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (typeof q.isActive !== "undefined") {
    const bool = String(q.isActive).toLowerCase();
    if (bool === "true" || bool === "false") filter.isActive = bool === "true";
  }

  // Numeric filters: minPrice, maxPrice, minDuration, maxDuration
  const minPrice = q.minPrice != null ? Number(q.minPrice) : undefined;
  const maxPrice = q.maxPrice != null ? Number(q.maxPrice) : undefined;
  const minDuration = q.minDuration != null ? Number(q.minDuration) : undefined;
  const maxDuration = q.maxDuration != null ? Number(q.maxDuration) : undefined;

  if (minPrice != null || maxPrice != null) {
    filter.price = {};
    if (minPrice != null) filter.price.$gte = minPrice;
    if (maxPrice != null) filter.price.$lte = maxPrice;
  }

  if (minDuration != null || maxDuration != null) {
    filter.duration = {};
    if (minDuration != null) filter.duration.$gte = minDuration;
    if (maxDuration != null) filter.duration.$lte = maxDuration;
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
 * Create Course
 */
export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, duration, order, price, description, isActive } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: "name is required" });
      return;
    }

    const course = await Course.create({
      name,
      duration,
      price,
      description,
      isActive,
      order,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

/**
 * List Courses (pagination + filters)
 */
export const listCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit, skip, filter, sort } = parseListQuery(req.query);

    const [items, total] = await Promise.all([
      Course.find(filter).sort(sort).skip(skip).limit(limit),
      Course.countDocuments(filter),
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
 * Update Course by ID
 */
export const updateCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid course id" });
      return;
    }

    const { name, duration, price, order, description, isActive } = req.body;

    const updated = await Course.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(typeof name !== "undefined" && { name }),
          ...(typeof duration !== "undefined" && { duration }),
          ...(typeof price !== "undefined" && { price }),
          ...(typeof description !== "undefined" && { description }),
          ...(typeof isActive !== "undefined" && { isActive }),
          ...(typeof order !== "undefined" && { order }),
        },
      },
      { new: true, runValidators: true, context: "query" }
    );

    if (!updated) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updated,
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

/**
 * Delete Course by ID
 */
export const deleteCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid course id" });
      return;
    }

    const existing = await Course.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    await Course.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};
