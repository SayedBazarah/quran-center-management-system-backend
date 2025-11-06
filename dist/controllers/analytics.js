import { Branch, Enrollment, Log, Student } from "@/models";
// Helpers
function parseListQuery(q) {
    const page = Math.max(parseInt(String(q.page ?? "1"), 10), 1);
    const limit = Math.min(Math.max(parseInt(String(q.limit ?? "20"), 10), 1), 100);
    const skip = (page - 1) * limit;
    const search = String(q.search ?? "").trim();
    const filter = {};
    if (search) {
        filter.$or = [
            { note: { $regex: search, $options: "i" } },
            { action: { $regex: search, $options: "i" } },
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
export const globalAnalytics = async (req, res, next) => {
    try {
        const { start, end } = req.query;
        if (!start || !end) {
            res
                .status(400)
                .json({ error: "start and end are required ISO timestamps" });
            return;
        }
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (!(startDate < endDate)) {
            res.status(400).json({ error: "end must be greater than start" });
            return;
        }
        // 1. Fetch all branches
        const allBranches = await Branch.find({}, { _id: 1, name: 1 }).lean();
        // 2. Run three aggregations in parallel
        const [studentsByBranch, enrollmentsByBranch, enrollmentStatusCounts] = await Promise.all([
            // Students aggregation (same as before)
            Student.aggregate([
                { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
                {
                    $group: {
                        _id: "$branchId",
                        new_students: { $sum: 1 },
                        new_students_accepted: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ["$acceptedAt", startDate] },
                                            { $lt: ["$acceptedAt", endDate] },
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                    },
                },
            ]),
            // Enrollments aggregation (same as before)
            Enrollment.aggregate([
                {
                    $lookup: {
                        from: "students",
                        localField: "studentId",
                        foreignField: "_id",
                        as: "s",
                        pipeline: [{ $project: { branchId: 1 } }],
                    },
                },
                { $set: { branchId: { $arrayElemAt: ["$s.branchId", 0] } } },
                { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
                {
                    $group: {
                        _id: "$branchId",
                        new_enrollments: { $sum: 1 },
                        new_enrollments_accepted: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ["$acceptedAt", startDate] },
                                            { $lt: ["$acceptedAt", endDate] },
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                    },
                },
            ]),
            // NEW: Enrollment status counts by branch (all enrollments, not just new ones)
            Enrollment.aggregate([
                {
                    $lookup: {
                        from: "students",
                        localField: "studentId",
                        foreignField: "_id",
                        as: "s",
                        pipeline: [{ $project: { branchId: 1 } }],
                    },
                },
                { $set: { branchId: { $arrayElemAt: ["$s.branchId", 0] } } },
                // No date filter - count ALL current enrollments by status
                {
                    $group: {
                        _id: {
                            branchId: "$branchId",
                            status: "$status",
                        },
                        count: { $sum: 1 },
                    },
                },
                // Reshape to group by branch with status counts
                {
                    $group: {
                        _id: "$_id.branchId",
                        statusCounts: {
                            $push: {
                                status: "$_id.status",
                                count: "$count",
                            },
                        },
                    },
                },
            ]),
        ]);
        // 3. Create lookup maps
        const studentMap = new Map(studentsByBranch.map((s) => [String(s._id), s]));
        const enrollmentMap = new Map(enrollmentsByBranch.map((e) => [String(e._id), e]));
        // Convert status counts array to object { active: 1, late: 2, ... }
        const statusCountMap = new Map(enrollmentStatusCounts.map((item) => {
            const statusObj = {};
            item.statusCounts.forEach((sc) => {
                statusObj[sc.status] = sc.count;
            });
            return [String(item._id), statusObj];
        }));
        // 4. Build result with all branches, defaulting to 0 and empty status object
        const result = allBranches.map((branch) => {
            const branchIdStr = String(branch._id);
            const studentData = studentMap.get(branchIdStr);
            const enrollmentData = enrollmentMap.get(branchIdStr);
            const statusCounts = statusCountMap.get(branchIdStr) || {};
            return {
                branchName: branch.name,
                new_students: studentData?.new_students || 0,
                new_students_accepted: studentData?.new_students_accepted || 0,
                new_enrollments: enrollmentData?.new_enrollments || 0,
                new_enrollments_accepted: enrollmentData?.new_enrollments_accepted || 0,
                enrollment_status_counts: statusCounts, // NEW: { active: 5, late: 2, pending: 1, ... }
            };
        });
        console.log(result);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message || "Internal Server Error" });
    }
};
export const oldGlobalAnalytics = async (req, res, next) => {
    try {
        const { start, end, branchId } = req.query;
        if (!start || !end) {
            res
                .status(400)
                .json({ error: "start and end are required ISO timestamps" });
            return;
        }
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            res.status(400).json({ error: "Invalid date format for start or end" });
            return;
        }
        if (endDate <= startDate) {
            res.status(400).json({ error: "end must be greater than start" });
            return;
        }
        // Common window filter
        const windowCreated = { $gte: startDate, $lt: endDate };
        // Optional branch scoping
        const studentScope = { createdAt: windowCreated };
        const enrollmentScope = { createdAt: windowCreated };
        if (branchId) {
            studentScope.branchId = branchId;
            // If enrollments need branch scope through student, either:
            //  - denormalize branchId on Enrollment, or
            //  - left join via aggregation. For now, assume no branch filter for enrollments unless denormalized.
            // Option A (if Enrollment has branchId): enrollmentScope.branchId = branchId;
        }
        // Acceptance window filter (authoritative by acceptedAt)
        const studentAcceptedFilter = {
            acceptedAt: { $gte: startDate, $lt: endDate },
        };
        if (branchId)
            studentAcceptedFilter["branchId"] = branchId;
        const enrollmentAcceptedFilter = {
            acceptedAt: { $gte: startDate, $lt: endDate },
        };
        // Parallel counts
        const [newStudents, newStudentsAccepted, newEnrollments, newEnrollmentsAccepted,] = await Promise.all([
            Student.countDocuments(studentScope),
            Student.countDocuments(studentAcceptedFilter),
            Enrollment.countDocuments(enrollmentScope),
            Enrollment.countDocuments(enrollmentAcceptedFilter),
        ]);
        res.json({
            window: { start: startDate.toISOString(), end: endDate.toISOString() },
            scope: { branchId: branchId || null },
            counts: {
                new_students: newStudents,
                new_students_accepted: newStudentsAccepted,
                new_enrollments: newEnrollments,
                new_enrollments_accepted: newEnrollmentsAccepted,
            },
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message || "Internal Server Error" });
    }
};
export const globalLogs = async (req, res, next) => {
    try {
        const { page, limit, skip, filter, sort } = parseListQuery(req.query);
        const [items, total] = await Promise.all([
            Log.find(filter).sort(sort).skip(skip).limit(limit),
            Log.countDocuments(filter),
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
//# sourceMappingURL=analytics.js.map