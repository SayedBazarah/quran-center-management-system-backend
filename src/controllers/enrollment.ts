// src/controllers/enrollmentController.ts
import { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'
import { Enrollment, Course, Student, Teacher, Admin, Log } from '@/models'
import { EnrollmentStatus, getEnumValues, StudentStatus } from '@/types/enums'
import { LogAction } from '@/models/log'

// Shared pagination + search + sorting
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
    filter.$or = [{ note: { $regex: search, $options: 'i' } }] // if you add notes at enrollment-level
  }

  // optional filters
  if (q.status) filter.status = String(q.status)
  if (q.courseId && Types.ObjectId.isValid(String(q.courseId))) {
    filter.courseId = new Types.ObjectId(String(q.courseId))
  }
  if (q.teacherId && Types.ObjectId.isValid(String(q.teacherId))) {
    filter.teacherId = new Types.ObjectId(String(q.teacherId))
  }
  if (q.adminId && Types.ObjectId.isValid(String(q.adminId))) {
    filter.adminId = new Types.ObjectId(String(q.adminId))
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
 * Create Enrollment
 * Required: courseId, studentId, optional: teacherId, adminId, startDate/endDate
 * Enforces: course, student, and (if provided) teacher/admin must exist
 */
export const createEnrollment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.params.studentId as string
    const { courseId, startDate, teacherId, adminId } = req.body

    // Existence checks
    const [course, student, teacher, admin, activeEnrollment, alreadyEnrolled] =
      await Promise.all([
        Course.findById(courseId),
        Student.findById(studentId),
        Teacher.findById(teacherId),
        Admin.findById(adminId),
        Enrollment.findOne({
          studentId,
          status: {
            $in: [
              EnrollmentStatus.PENDING,
              EnrollmentStatus.ACTIVE,
              EnrollmentStatus.LATE,
            ],
          },
        }),
        Enrollment.findOne({
          studentId,
          courseId,
        }),
      ])

    if (!course) {
      res.status(404).json({ success: false, message: 'المرحلة غير موجودة' })
      return
    }
    if (!student) {
      res.status(404).json({ success: false, message: 'الطالب غير موجود' })
      return
    }
    if (student.status !== StudentStatus.ACTIVE) {
      res.status(400).json({
        success: false,
        message:
          'يجب أن يكون الطالب يدرس، وليس اي حالة اخري لتسجيل في مرحلة جديدة',
      })
      return
    }

    if (!teacher) {
      res.status(404).json({ success: false, message: 'المعلم غير موجود' })
      return
    }

    if (!admin) {
      res.status(404).json({ success: false, message: 'المدير غير موجود' })
      return
    }

    if (
      alreadyEnrolled &&
      alreadyEnrolled.status !== EnrollmentStatus.REJECTED
    ) {
      res.status(400).json({
        success: false,
        message: 'الطالب سجل بالفعل في هذه المرحلة',
      })
      return
    }

    if (activeEnrollment) {
      res.status(400).json({
        success: false,
        message: 'الطالب لدية مرحلة لم ينتهي منها بعد',
      })
      return
    }
    // One student per course unique pair is enforced by index in model; catch E11000 globally
    const enrollment = await Enrollment.create({
      status: EnrollmentStatus.PENDING,
      startDate: startDate ? new Date(startDate) : new Date(),
      courseId,
      studentId,
      teacherId,
      adminId,
      createdBy: req.user?.id,
    })

    await Log.create({
      action: LogAction.ENROLL,
      studentId: student._id,
      enrollmentId: enrollment._id,
      adminId: new Types.ObjectId(`${req.user?.id}`),
      note: `تم تسجيل الطالب بمرحلة ${course.name} بواسطة ${req.user?.name}`,
    })

    res.status(201).json({
      success: true,
      message: 'تم تسجيل الطالب بمرحلة جديدة',
      data: enrollment,
    })
    return
  } catch (err) {
    next(err)
    return
  }
}

/**
 * Edit Enrollment (by id)
 * Allows updating status, dates, and relations (with validation)
 */
export const updateEnrollmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string

    const { teacherId, adminId, status } = req.body

    // Optional existence checks
    const checks: Promise<any>[] = []
    if (teacherId) checks.push(Teacher.findById(teacherId))
    if (adminId) checks.push(Admin.findById(adminId))
    const existence = await Promise.all(checks)
    if (existence.includes(null)) {
      res
        .status(404)
        .json({ success: false, message: 'Related document not found' })
      return
    }
    const original = await Enrollment.findById(id)
      .populate({
        path: 'teacherId',
        select: '_id name',
      })
      .populate({
        path: 'adminId',
        select: '_id name',
      })
      .populate({
        path: 'studentId',
        select: 'name',
      })

    if (!original) {
      res.status(404).json({ success: false, message: 'Enrollment not found' })
      return
    }

    const updated = await Enrollment.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(typeof teacherId !== 'undefined' && { teacherId }),
          ...(typeof adminId !== 'undefined' && { adminId }),
          ...(typeof status !== 'undefined' && { status }),
        },
      },
      { new: true, runValidators: true, context: 'query' }
    )
      .populate({
        path: 'teacherId',
        select: '_id name',
      })
      .populate({
        path: 'adminId',
        select: '_id name',
      })

    if (!updated) {
      res.status(404).json({ success: false, message: 'Enrollment not found' })
      return
    }
    await Log.create({
      action: LogAction.UPDATE,
      studentId: updated.studentId,
      enrollmentId: updated._id,
      adminId: new Types.ObjectId(`${req.user?.id}`),
      note: `تم تعديل بيانات الطالب ${
        (original.studentId as any)?.name
      } بواسطة المشرف  ${req.user?.name}، 
      ${
        (updated?.status !== original?.status &&
          'تم تغير حالة المرحلة من ' +
            getEnumValues(EnrollmentStatus)[
              getEnumValues(EnrollmentStatus).indexOf(original.status)
            ] +
            ' إلى ' +
            getEnumValues(EnrollmentStatus)[
              getEnumValues(EnrollmentStatus).indexOf(updated.status)
            ]) ||
        ''
      }
      ${
        (updated?.teacherId?.id !== original?.teacherId?.id &&
          'تم تغير المعلم من ' +
            (original?.teacherId as any)?.name +
            ' إلى ' +
            (updated?.teacherId as any)?.name) ||
        ''
      }
      ${
        (updated?.adminId?.id !== original?.adminId?.id &&
          'تم تغير بيانات مشرف الدورة من ' +
            (original?.adminId as any)?.name +
            ' إلى ' +
            (updated?.adminId as any)?.name) ||
        ''
      }
      `,
    })

    res.status(200).json({
      success: true,
      message: 'Enrollment updated successfully',
      data: updated,
    })
    return
  } catch (err) {
    next(err)
    return
  }
}

/**
 * Delete Enrollment (by id)
 */
export const deleteEnrollmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid enrollment id' })
      return
    }

    const existing = await Enrollment.findById(id)
    if (!existing) {
      res.status(404).json({ success: false, message: 'Enrollment not found' })
      return
    }

    await Enrollment.deleteOne({ _id: id })

    res.status(200).json({
      success: true,
      message: 'Enrollment deleted successfully',
    })
    return
  } catch (err) {
    next(err)
    return
  }
}

/**
 * List all Enrollments for a Student by studentId
 */
export const listEnrollmentsByStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.params.studentId as string
    if (!Types.ObjectId.isValid(studentId)) {
      res.status(400).json({ success: false, message: 'Invalid studentId' })
      return
    }

    const { page, limit, skip, sort } = parseListQuery(req.query)
    const filter = { studentId: new Types.ObjectId(studentId) }

    const [items, total] = await Promise.all([
      Enrollment.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate({ path: 'teacherId', select: '_id name' })
        .populate({ path: 'adminId', select: '_id name' })
        .populate({ path: 'courseId', select: '_id name' })
        .populate({ path: 'createdBy', select: '_id name' })
        .populate({
          path: 'acceptedBy',
          select: '_id name',
        })
        .populate({
          path: 'logs',
          select: '_id action note changes createdAt adminId enrollmentId',
          options: { sort: { createdAt: -1 } }, // newest first
          populate: { path: 'adminId', select: '_id name' },
        })
        .populate({ path: 'rejectedBy', select: '_id name' }),
      Enrollment.countDocuments(filter),
    ])

    res.status(200).json({
      success: true,
      data: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
    return
  } catch (err) {
    next(err)
    return
  }
}

/**
 * List all pending Enrollments (require admin accept)
 */
export const listPendingEnrollments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit, skip, sort } = parseListQuery(req.query)

    const [items, total] = await Promise.all([
      Enrollment.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'courseId',
          select: 'name',
        })
        .populate({
          path: 'studentId',
          select: 'name phone',
        })
        .populate({ path: 'teacherId', select: 'name' })
        .populate({ path: 'adminId', select: 'name' })
        .populate({ path: 'createdBy', select: 'name' }),
      Enrollment.countDocuments(filter),
    ])

    res.status(200).json({
      success: true,
      data: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
    return
  } catch (err) {
    next(err)
    return
  }
}

// List enrollments that are late (endDate < today, status can be anything)
// Optional filters supported via query: courseId, teacherId, adminId, studentId
export const listLateEnrollments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Compute "start of today" in server timezone to avoid partial-day mismatches
    const now = new Date()
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    )

    // Reuse generic list parser for pagination + sorting
    const { page, limit, skip, sort } = (function parse(q: Request['query']) {
      const page = Math.max(parseInt(String(q.page ?? '1'), 10), 1)
      const limit = Math.min(
        Math.max(parseInt(String(q.limit ?? '20'), 10), 1),
        100
      )
      const skip = (page - 1) * limit

      const sortRaw = String(q.sort ?? '-endDate') // default most overdue first
      const sort: Record<string, 1 | -1> = {}
      sortRaw.split(',').forEach((token) => {
        const t = token.trim()
        if (!t) return
        if (t.startsWith('-')) sort[t.slice(1)] = -1
        else sort[t] = 1
      })

      return { page, limit, skip, sort }
    })(req.query)

    // Build filter: endDate < startOfToday
    const filter: Record<string, any> = { endDate: { $lt: startOfToday } }

    // Optional filters by ids
    const { courseId, teacherId, adminId, studentId } = req.query
    if (courseId && Types.ObjectId.isValid(String(courseId))) {
      filter.courseId = new Types.ObjectId(String(courseId))
    }
    if (teacherId && Types.ObjectId.isValid(String(teacherId))) {
      filter.teacherId = new Types.ObjectId(String(teacherId))
    }
    if (adminId && Types.ObjectId.isValid(String(adminId))) {
      filter.adminId = new Types.ObjectId(String(adminId))
    }
    if (studentId && Types.ObjectId.isValid(String(studentId))) {
      filter.studentId = new Types.ObjectId(String(studentId))
    }

    const [items, total] = await Promise.all([
      Enrollment.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('courseId')
        .populate('studentId')
        .populate('teacherId')
        .populate('adminId'),
      Enrollment.countDocuments(filter),
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
 * Accept Enrollment (status -> active)
 */
export const enrollmentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const enrollmentId = req.params.enrollmentId as string
    const { status, reason } = req.body
    const enrollment = await Enrollment.findById(enrollmentId).populate({
      path: 'studentId',
      select: 'name',
    })

    if (!enrollment) {
      res.status(404).json({ success: false, message: 'Enrollment not found' })
      return
    }

    if (status === EnrollmentStatus.ACTIVE) {
      enrollment.status = EnrollmentStatus.ACTIVE
      enrollment.acceptedBy = new Types.ObjectId(`${req.user?.id}`)
      enrollment.acceptedAt = new Date()
    } else if (status === EnrollmentStatus.REJECTED) {
      enrollment.status = EnrollmentStatus.REJECTED
      enrollment.rejectedBy = new Types.ObjectId(`${req.user?.id}`)
      enrollment.rejectionReason = reason
      enrollment.rejectedAt = new Date()
    }

    await enrollment.save()

    await Log.create({
      action: LogAction.ENROLL,
      studentId: enrollment.studentId?.id,
      enrollmentId: enrollment._id,
      adminId: new Types.ObjectId(`${req.user?.id}`),
      note:
        (status === EnrollmentStatus.ACTIVE &&
          `تم قبول الدورة لطالب ${(enrollment.studentId as any)?.name} بواسطة ${
            req.user?.name
          }`) ||
        (status === EnrollmentStatus.REJECTED &&
          `تم رفض الدورة لمشرف ${(enrollment.studentId as any)?.name} بواسطة ${
            req.user?.name
          } بسبب ${reason}`),
    })

    res.status(200).json({
      success: true,
      message: 'Enrollment accepted (status set to active)',
      data: enrollment,
    })
    return
  } catch (err) {
    next(err)
    return
  }
}

/**
 * Reject Enrollment (status -> dropout, set endDate now)
 */
export const rejectEnrollment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid enrollment id' })
      return
    }

    const enrollment = await Enrollment.findById(id)
    if (!enrollment) {
      res.status(404).json({ success: false, message: 'Enrollment not found' })
      return
    }

    enrollment.status = EnrollmentStatus.DROPOUT
    enrollment.endDate = new Date()
    await enrollment.save()

    res.status(200).json({
      success: true,
      message: 'Enrollment rejected (status set to dropout)',
      data: enrollment,
    })
    return
  } catch (err) {
    next(err)
    return
  }
}

/**
 * Close Enrollment as Graduated (status -> end + set student.graduated + status GRADUATED)
 * If you prefer: set status to END and also mark student as graduated
 */
export const closeEnrollmentAsGraduated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid enrollment id' })
      return
    }

    const enrollment = await Enrollment.findById(id)
    if (!enrollment) {
      res.status(404).json({ success: false, message: 'Enrollment not found' })
      return
    }

    // Close enrollment
    enrollment.status = EnrollmentStatus.GRADUATED
    enrollment.endDate = new Date()
    await enrollment.save()

    // Mark student as graduated via method on Student model (if present)
    // or set fields directly:
    const student = await Student.findById(enrollment.studentId)
    if (student) {
      student.graduated = new Date()
      // status auto-updates to GRADUATED in Student pre-save, per earlier model
      await student.save()
    }

    res.status(200).json({
      success: true,
      message: 'Enrollment closed and student marked as graduated',
      data: enrollment,
    })
    return
  } catch (err) {
    next(err)
    return
  }
}

export const createEnrollmentLog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.params.studentId as string
    const enrollmentId = req.params.enrollmentId as string
    const { note } = req.body

    const log = await Log.create({
      studentId: new Types.ObjectId(studentId),
      enrollmentId: new Types.ObjectId(enrollmentId),
      note,
      action: LogAction.ENROLL,
      adminId: new Types.ObjectId(`${req.user?.id}`),
    })

    res.status(201).json({
      success: true,
      message: 'Enrollment log created successfully',
      data: log,
    })
    return
  } catch (err) {
    next(err)
    return
  }
}
