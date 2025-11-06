// src/models/Enrollment.ts
import { EnrollmentStatus, getEnumValues } from "@/types/enums";
import mongoose, { Schema } from "mongoose";
const EnrollmentSchema = new Schema({
    status: {
        type: String,
        enum: getEnumValues(EnrollmentStatus),
        default: EnrollmentStatus.PENDING,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
    },
    // relations
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: [true, "Course is required"],
        index: true,
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: [true, "Student is required"],
        index: true,
    },
    teacherId: {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
        index: true,
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        index: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        index: true,
    },
    // Admin only
    rejectionReason: {
        type: Schema.Types.String,
        maxlength: [200, "Address cannot exceed 200 characters"],
    },
    rejectedBy: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        index: true,
    },
    rejectedAt: {
        type: Date,
    },
    acceptedBy: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        index: true,
    },
    acceptedAt: {
        type: Date,
    },
}, {
    timestamps: true,
    collection: "enrollments",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Indexes for common queries
EnrollmentSchema.index({ studentId: 1, status: 1 });
EnrollmentSchema.index({ teacherId: 1, status: 1 });
EnrollmentSchema.index({ startDate: 1 });
EnrollmentSchema.index({ endDate: 1 });
// Virtuals: back refs
EnrollmentSchema.virtual("logs", {
    ref: "Log",
    localField: "_id",
    foreignField: "enrollmentId",
    justOne: false,
});
EnrollmentSchema.virtual("payments", {
    ref: "Payment",
    localField: "_id",
    foreignField: "enrollmentId",
    justOne: false,
});
EnrollmentSchema.virtual("logs", {
    ref: "Log", // model name for ILog
    localField: "_id", // Enrollment._id
    foreignField: "enrollmentId", // ILog.enrollmentId
    justOne: false,
});
// Methods
EnrollmentSchema.methods.isActiveNow = function () {
    const now = new Date();
    const started = this.startDate ? now >= this.startDate : true;
    const notEnded = this.endDate ? now <= this.endDate : true;
    return started && notEnded && this.status === EnrollmentStatus.ACTIVE;
};
EnrollmentSchema.methods.close = async function (status = EnrollmentStatus.GRADUATED) {
    this.status = status;
    this.endDate = new Date();
    await this.save();
};
export default mongoose.model("Enrollment", EnrollmentSchema);
//# sourceMappingURL=enrollment.js.map