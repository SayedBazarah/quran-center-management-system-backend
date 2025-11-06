"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
/**
 * Role Schema
 */
const RoleSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Role name is required"],
        unique: true,
        trim: true,
        minlength: [3, "Role name must be at least 3 characters"],
        maxlength: [50, "Role name cannot exceed 50 characters"],
    },
    permissions: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "Permission", index: true },
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
    const adminCount = await mongoose_1.default.models.Admin.countDocuments({ roleId: this._id });
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
exports.default = mongoose_1.default.model("Role", RoleSchema);
