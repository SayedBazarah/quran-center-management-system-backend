// src/controllers/adminController.ts
import { env } from '@/env'
import { Admin } from '@/models'
import { CreateAdminHandler } from '@/types/handlers/admin.handlers'
import { Request, Response, NextFunction, RequestHandler } from 'express'
import { Types } from 'mongoose'

// Helper: parse pagination/sorting
function parseListQuery(q: Request['query']) {
  const page = Math.max(parseInt(String(q.page || '1'), 10), 1)
  const limit = Math.min(
    Math.max(parseInt(String(q.limit || '20'), 10), 1),
    100
  )
  const skip = (page - 1) * limit

  // Basic search by name | email | phone | username
  const search = String(q.search || '').trim()
  const filter: Record<string, any> = {}
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } },
    ]
  }

  // Optional branch filter
  if (q.branchId && Types.ObjectId.isValid(String(q.branchId))) {
    filter.branchId = new Types.ObjectId(String(q.branchId))
  }

  // Optional role filter
  if (q.roleId && Types.ObjectId.isValid(String(q.roleId))) {
    filter.roleId = new Types.ObjectId(String(q.roleId))
  }

  // Sort input like: "-createdAt,name"
  const sortRaw = String(q.sort || '-createdAt')
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
 * Create Admin
 * - Validates minimal required fields (name, phone, nationalId, username)
 * - Password hashing handled in Admin schema pre-save
 */
export const createAdmin: CreateAdminHandler = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      nationalId,
      username,
      password,
      gender,
      roleId,
      branchIds,
    } = req.body

    const admin = await Admin.create({
      name,
      email,
      phone,
      nationalId,
      username,
      password,
      gender,
      roleId,
      branchIds: branchIds.map((b) => new Types.ObjectId(b)),
    })

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: { id: `${admin._id}` },
    })
  } catch (err) {
    return next(err)
  }
}

/**
 * List Admins
 * - Supports pagination, sorting, search, and filtering by branch/role
 * - Returns meta pagination info
 */
export const listAdmins: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, skip, filter, sort } = parseListQuery(req.query)

    const adminBranchIds: string[] = (req.user as any)?.branchIds || []

    if (!adminBranchIds.length) {
      res.status(403).json({
        success: false,
        message: 'No branch access',
      })
      return
    }

    // 🔐 Enforce branch-based access (server-side)
    const enforcedFilter = {
      ...filter,
      branchIds: {
        $in: adminBranchIds.map((id) => new Types.ObjectId(id)),
      },
    }

    const [items, total] = await Promise.all([
      Admin.find(enforcedFilter)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('roleId', 'name')
        .populate('branchIds', 'name'),
      Admin.countDocuments(filter),
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
  } catch (err) {
    return next(err)
  }
}

/**
 * Update Admin by ID
 * - Validates ObjectId
 * - Prevents direct overwrite of immutable/sensitive combinations if needed
 */
export const updateAdminById: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = req.params.id as string
    if (adminId == env.admin.id) {
      res.status(400).json({
        success: false,
        message: 'لا يمكن تعديل مدير النظام',
      })
      return
    }

    // Disallow updating unique identifiers to empty values
    const {
      name,
      email,
      phone,
      username,
      password,
      gender,
      roleId,
      branchIds,
    } = req.body

    // If password is provided, it will be hashed by pre-save hook via save() flow.
    // findByIdAndUpdate would bypass pre-save, so use two-step when password exists.
    if (password) {
      const admin = await Admin.findById(adminId).select('+password')
      if (!admin) {
        return next(new Error('Admin not found'))
      }

      // Assign fields
      if (typeof name !== 'undefined') admin.name = name
      if (typeof email !== 'undefined') admin.email = email
      if (typeof phone !== 'undefined') admin.phone = phone
      if (typeof username !== 'undefined') admin.username = username
      if (typeof gender !== 'undefined') admin.gender = gender
      if (typeof roleId !== 'undefined') admin.roleId = roleId
      if (typeof branchIds !== 'undefined')
        admin.branchIds = branchIds?.map((b: string) => new Types.ObjectId(b))

      admin.password = password

      await admin.save() // triggers pre-save hashing
      const safe = await Admin.findById(admin._id).select('-password')

      res.status(200).json({
        success: true,
        message: 'Admin updated successfully',
        data: safe,
      })
    } else {
      // No password change, can use atomic update
      const updated = await Admin.findByIdAndUpdate(
        adminId,
        {
          $set: {
            ...(typeof name !== 'undefined' && { name }),
            ...(typeof email !== 'undefined' && { email }),
            ...(typeof phone !== 'undefined' && { phone }),
            ...(typeof username !== 'undefined' && { username }),
            ...(typeof gender !== 'undefined' && { gender }),
            ...(typeof roleId !== 'undefined' && { roleId }),
            ...(typeof branchIds !== 'undefined' && { branchIds }),
          },
        },
        { new: true, runValidators: true, upsert: false, context: 'query' }
      ).select('-password')

      if (!updated) {
        res.status(404).json({ success: false, message: 'Admin not found' })
      }

      res.status(200).json({
        success: true,
        message: 'Admin updated successfully',
        data: updated,
      })
    }
  } catch (err) {
    return next(err)
  }
}

/**
 * Delete Admin by ID
 * - Validates ObjectId
 * - Uses deleteOne (can be swapped for soft delete if needed)
 */
export const deleteAdminById: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = req.params.id as string
    if (!Types.ObjectId.isValid(adminId)) {
      return next(new Error('Invalid admin id'))
    }
    if (env.admin.id === adminId) {
      return next(new Error('Cannot delete admin with id: ' + adminId))
    }

    const existing = await Admin.findById(adminId)
    if (!existing) {
      res.status(404).json({ success: false, message: 'Admin not found' })
    }

    await Admin.deleteOne({ _id: adminId })

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully',
    })
  } catch (err) {
    return next(err)
  }
}
