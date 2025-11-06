import { Gender, StudentStatus } from "@/types/enums";
import mongoose, { Schema } from "mongoose";
/**
 * Student Schema
 */
const StudentSchema = new Schema({
    name: {
        type: String,
        required: [true, "Student name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
        type: String,
        sparse: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email",
        ],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        trim: true,
        match: [
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
            "Please provide a valid phone number",
        ],
    },
    nationalId: {
        type: String,
        required: [true, "National ID is required"],
        unique: true,
        trim: true,
        minlength: [10, "National ID must be at least 10 characters"],
    },
    nationalIdImg: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String,
        trim: true,
    },
    birthDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value < new Date();
            },
            message: "Birth date cannot be in the future",
        },
    },
    gender: {
        type: String,
        enum: Object.values(Gender),
    },
    address: {
        type: String,
        trim: true,
        maxlength: [200, "Address cannot exceed 200 characters"],
    },
    status: {
        type: String,
        enum: Object.values(StudentStatus),
        default: StudentStatus.PENDING,
    },
    // Firing tracking
    fired: {
        type: Boolean,
        default: false,
    },
    firedAt: {
        type: Date,
    },
    firedById: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
    },
    // Graduation tracking
    graduated: {
        type: Date,
    },
    // Acceptance tracking
    acceptedById: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
    },
    rejectedById: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
    },
    rejectionReason: {
        type: Schema.Types.String,
        maxlength: [200, "Address cannot exceed 200 characters"],
    },
    acceptedAt: {
        type: Date,
    },
    rejectedAt: {
        type: Date,
    },
    // Relations
    branchId: {
        type: Schema.Types.ObjectId,
        ref: "Branch",
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: "Parent",
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
    },
}, {
    timestamps: true,
    collection: "students",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// ============================================================================
// INDEXES
// ============================================================================
StudentSchema.index({ branchId: 1, status: 1 });
StudentSchema.index({ fired: 1 });
StudentSchema.index({ adminId: 1 });
// ============================================================================
// VIRTUALS
// ============================================================================
StudentSchema.virtual("enrollments", {
    ref: "Enrollment",
    localField: "_id",
    foreignField: "studentId",
    justOne: false,
});
StudentSchema.virtual("payments", {
    ref: "Payment",
    localField: "_id",
    foreignField: "studentId",
    justOne: false,
});
StudentSchema.virtual("enrollmentLogs", {
    ref: "EnrollmentLog",
    localField: "_id",
    foreignField: "studentId",
    justOne: false,
});
StudentSchema.virtual("age").get(function () {
    if (!this.birthDate)
        return null;
    const today = new Date();
    const birthDate = new Date(this.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});
// ============================================================================
// MIDDLEWARE
// ============================================================================
/**
 * Pre-save: Auto-update status based on fired/graduated
 */
StudentSchema.pre("save", function (next) {
    if (this.fired) {
        this.status = StudentStatus.DROPOUT;
    }
    else if (this.graduated) {
        this.status = StudentStatus.GRADUATED;
    }
    next();
});
// ============================================================================
// METHODS
// ============================================================================
/**
 * Mark student as fired
 */
StudentSchema.methods.markAsFired = async function (adminId, reason) {
    this.fired = true;
    this.firedAt = new Date();
    this.firedById = adminId;
    this.status = StudentStatus.DROPOUT;
    // Log the action
    await mongoose.models.Log.create({
        studentId: this._id,
        adminId,
        note: reason || "Student marked as fired",
    });
    await this.save();
};
/**
 * Mark student as graduated
 */
StudentSchema.methods.markAsGraduated = async function () {
    this.graduated = new Date();
    this.status = StudentStatus.GRADUATED;
    await this.save();
};
// ============================================================================
// STATIC METHODS
// ============================================================================
/**
 * Get active students by branch
 */
StudentSchema.statics.getActiveByBranch = function (branchId) {
    return this.find({
        branchId,
        fired: false,
        status: { $in: [StudentStatus.ACTIVE, StudentStatus.PENDING] },
    });
};
/**
 * Get students by status
 */
StudentSchema.statics.getByStatus = function (status) {
    return this.find({ status }).populate("branchId parentId");
};
export default mongoose.model("Student", StudentSchema);
//# sourceMappingURL=student.js.map