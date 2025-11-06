// src/jobs/tasks/markLateEnrollments.ts
import { env } from "@/env";
import { Enrollment, Log } from "@/models";
import { LogAction } from "@/models/log";
import { Types } from "mongoose";

export async function markLateEnrollmentsJob() {
  const now = new Date();

  // 1) Find active enrollments with course duration and computed deadline
  const overdue = await Enrollment.aggregate([
    { $match: { status: "active" } },
    {
      $lookup: {
        from: "courses",
        localField: "courseId",
        foreignField: "_id",
        as: "course",
      },
    },
    { $unwind: "$course" },
    {
      $addFields: {
        deadline: {
          $add: [
            "$startDate",
            { $multiply: ["$course.duration", 24 * 60 * 60 * 1000] },
          ],
        },
      },
    },
    { $match: { deadline: { $lt: now } } },
    {
      $project: {
        _id: 1,
        studentId: 1,
        courseId: 1,
        startDate: 1,
        deadline: 1,
      },
    },
  ]);

  if (!overdue.length) return { updated: 0 };

  // 2) Prepare bulk updates for enrollments -> late
  const enrollmentBulk = Enrollment.collection.initializeUnorderedBulkOp();
  for (const e of overdue) {
    enrollmentBulk
      .find({ _id: e._id, status: "active" })
      .updateOne({ $set: { status: "late", lateAt: now } });
  }

  // 4) Insert logs (one per overdue enrollment)
  const logs = overdue.map((e) => ({
    action: LogAction.SYSTEM,
    note: "الطالب متاخر ",
    studentId: e.studentId as Types.ObjectId,
    enrollmentId: e._id as Types.ObjectId,
    adminId: env.admin.id,
    changes: [
      { field: "enrollment.status", from: "active", to: "late" },
      { field: "student.status", from: "active", to: "late" },
    ],
  }));

  // // 5) Execute atomically per collection
  // const [enrRes] = await Promise.all([
  //   enrollmentBulk.length ? enrollmentBulk.execute() : Promise.resolve(null),
  // ]);
  if (logs.length) await Log.insertMany(logs, { ordered: false });
  return;
}
