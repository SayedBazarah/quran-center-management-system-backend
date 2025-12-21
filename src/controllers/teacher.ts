// src/controllers/teacherController.ts
import { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'
import { Teacher, Branch } from '@/models'

// Shared list parser (pagination, search, sorting, optional branch filter)
function parseListQuery(q: Request['query']) {
  const page = Math.max(parseInt(String(q.page ?? '1'), 10), 1)
  const limit = Math.min(
    Math.max(parseInt(String(q.limit ?? '20'), 10), 1),
    100
  )
  const skip = (page - 1) * limit

  const search = String(q.search ?? '').trim()
  const filter: Record<string, any> = {}

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } },
    ]
  }

  if (q.branchId && Types.ObjectId.isValid(String(q.branchId))) {
    filter.branchId = new Types.ObjectId(String(q.branchId))
  }

  const sortRaw = String(q.sort ?? '-createdAt')
  const sort: Record<string, 1 | -1> = {}
  sortRaw.split(',').forEach((token) => {
    const t = token.trim()
    if (!t) return
    if (t.startsWith('-')) sort[t.slice(1)] = -1
    else sort[t] = 1
  })

  return { page, limit, skip, filter, sort }
}

/**
 * Create Teacher
 * Required: name, email, nationalId, username, branchId
 */
export const createTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, phone, nationalId, username, gender, branchId } =
      req.body

    const teacher = await Teacher.create({
      name,
      email,
      phone,
      nationalId,
      username,
      gender,
      branchId,
    })

    // Exclude password in response (schema selects false by default)
    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      data: teacher,
    })
    return
  } catch (err) {
    next(err)
    return
  }
}

/**
 * List Teachers (pagination, search, optional branch filter)
 */
export const listTeachers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit, skip, filter, sort } = parseListQuery(req.query)
    const adminBranchIds: string[] = (req.user as any)?.branchIds || []

    if (!adminBranchIds.length) {
      res.status(403).json({ success: false, message: 'No branch access' })
      return
    }
    const newFilter = {
      ...filter,
      branchId: { $in: adminBranchIds.map((id) => new Types.ObjectId(id)) },
    }

    const [items, total] = await Promise.all([
      Teacher.find(newFilter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'branchId',
          populate: {
            path: 'name',
          },
        }),
      Teacher.countDocuments(filter),
    ])

    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
    return
  } catch (err) {
    next(err)
    return
  }
}

/**
 * Edit Teacher by ID
 * If password provided, use findById -> assign -> save() to trigger hashing
 */
export const updateTeacherById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid teacher id' })
      return
    }

    const { name, email, phone, nationalId, gender, branchId } = req.body

    if (typeof branchId !== 'undefined') {
      if (!Types.ObjectId.isValid(branchId)) {
        res.status(400).json({ success: false, message: 'Invalid branchId' })
        return
      }
      const branch = await Branch.findById(branchId)
      if (!branch) {
        res.status(404).json({ success: false, message: 'Branch not found' })
        return
      }
    }

    const updated = await Teacher.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(typeof name !== 'undefined' && { name }),
          ...(typeof email !== 'undefined' && { email }),
          ...(typeof phone !== 'undefined' && { phone }),
          ...(typeof nationalId !== 'undefined' && { nationalId }),
          ...(typeof gender !== 'undefined' && { gender }),
          ...(typeof branchId !== 'undefined' && { branchId }),
        },
      },
      { new: true, runValidators: true, context: 'query' }
    ).populate('branchId')

    if (!updated) {
      res.status(404).json({ success: false, message: 'Teacher not found' })
      return
    }

    res.status(200).json({
      success: true,
      message: 'Teacher updated successfully',
      data: updated,
    })
    return
  } catch (err) {
    next(err)
    return
  }
}

/**
 * Delete Teacher by ID
 */
export const deleteTeacherById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid teacher id' })
      return
    }

    const existing = await Teacher.findById(id)
    if (!existing) {
      res.status(404).json({ success: false, message: 'Teacher not found' })
      return
    }

    await Teacher.deleteOne({ _id: id })

    res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully',
    })
    return
  } catch (err) {
    next(err)
    return
  }
}
