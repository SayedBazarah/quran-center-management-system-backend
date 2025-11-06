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
 * Branch Schema
 */
const BranchSchema = new mongoose_1.Schema({
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
        mongoose_1.default.models.Admin.countDocuments({
            branchId: this._id,
        }),
        mongoose_1.default.models.Teacher.countDocuments({
            branchId: this._id,
        }),
        mongoose_1.default.models.Student.countDocuments({
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
exports.default = mongoose_1.default.model("Branch", BranchSchema);
