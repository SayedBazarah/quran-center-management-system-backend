import mongoose, { Schema } from "mongoose";
/**
 * Role Schema
 */
const RoleSchema = new Schema({
    name: {
        type: String,
        required: [true, "Role name is required"],
        unique: true,
        trim: true,
        minlength: [3, "Role name must be at least 3 characters"],
        maxlength: [50, "Role name cannot exceed 50 characters"],
    },
    permissions: [
        { type: Schema.Types.ObjectId, ref: "Permission", index: true },
    ],
    isDefault: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    collection: "roles",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// ============================================================================
// VIRTUALS
// ============================================================================
RoleSchema.virtual("admins", {
    ref: "Admin",
    localField: "_id",
    foreignField: "roleId",
    justOne: false,
});
RoleSchema.virtual("permissionsVirtual", {
    ref: "Permission",
    localField: "_id",
    foreignField: "roleId",
    justOne: false,
});
// ============================================================================
// MIDDLEWARE
// ============================================================================
/**
 * Pre-remove: Prevent deletion of default role
 */
RoleSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    if (this.isDefault) {
        throw new Error("Cannot delete default role");
    }
    next();
});
/**
 * Pre-remove: Check if role is assigned to any admin
 */
RoleSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    const adminCount = await mongoose.models.Admin.countDocuments({ roleId: this._id });
    if (adminCount > 0) {
        throw new Error(`Cannot delete role. ${adminCount} admin(s) are assigned to this role.`);
    }
    next();
});
// ============================================================================
// STATIC METHODS
// ============================================================================
/**
 * Get default role
 */
RoleSchema.statics.getDefaultRole = function () {
    return this.findOne({ isDefault: true });
};
/**
 * Get role with permissions
 */
RoleSchema.statics.findWithPermissions = function (roleId) {
    return this.findById(roleId).populate("permissions");
};
export default mongoose.model("Role", RoleSchema);
//# sourceMappingURL=role.js.map