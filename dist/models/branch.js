import mongoose, { Schema } from "mongoose";
/**
 * Branch Schema
 */
const BranchSchema = new Schema({
    name: {
        type: String,
        required: [true, "Branch name is required"],
        unique: true,
        trim: true,
        minlength: [3, "Branch name must be at least 3 characters"],
        maxlength: [100, "Branch name cannot exceed 100 characters"],
    },
    address: {
        type: String,
        trim: true,
        maxlength: [200, "Address cannot exceed 200 characters"],
    },
    phone: {
        type: String,
        trim: true,
        match: [
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
            "Please provide a valid phone number",
        ],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    collection: "branches",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// ============================================================================
// VIRTUALS
// ============================================================================
BranchSchema.virtual("admins", {
    ref: "Admin",
    localField: "_id",
    foreignField: "branchId",
    justOne: false,
});
BranchSchema.virtual("teachers", {
    ref: "Teacher",
    localField: "_id",
    foreignField: "branchId",
    justOne: false,
});
BranchSchema.virtual("students", {
    ref: "Student",
    localField: "_id",
    foreignField: "branchId",
    justOne: false,
});
// ============================================================================
// METHODS
// ============================================================================
/**
 * Get branch statistics
 */
BranchSchema.methods.getStatistics = async function () {
    const [adminCount, teacherCount, studentCount] = await Promise.all([
        mongoose.models.Admin.countDocuments({
            branchId: this._id,
        }),
        mongoose.models.Teacher.countDocuments({
            branchId: this._id,
        }),
        mongoose.models.Student.countDocuments({
            branchId: this._id,
        }),
    ]);
    return {
        admins: adminCount,
        teachers: teacherCount,
        students: studentCount,
    };
};
// ============================================================================
// STATIC METHODS
// ============================================================================
/**
 * Get active branches
 */
BranchSchema.statics.getActiveBranches = function () {
    return this.find({ isActive: true }).sort({ name: 1 });
};
export default mongoose.model("Branch", BranchSchema);
//# sourceMappingURL=branch.js.map