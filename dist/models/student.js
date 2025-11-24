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
const enums_1 = require("../types/enums");
const mongoose_1 = __importStar(require("mongoose"));
/**
 * Student Schema
 */
const StudentSchema = new mongoose_1.Schema({
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
        trim: true,
        match: [
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
            "Please provide a valid phone number",
        ],
    },
    nationalId: {
        type: String,
        unique: true,
        trim: true,
        minlength: [13, "National ID must be at least 13 characters"],
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
        enum: Object.values(enums_1.Gender),
    },
    address: {
        type: String,
        trim: true,
        maxlength: [200, "Address cannot exceed 200 characters"],
    },
    status: {
        type: String,
        enum: Object.values(enums_1.StudentStatus),
        default: enums_1.StudentStatus.PENDING,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Admin",
    },
    // Graduation tracking
    graduated: {
        type: Date,
    },
    // Acceptance tracking
    acceptedById: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Admin",
    },
    rejectedById: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Admin",
    },
    rejectionReason: {
        type: mongoose_1.Schema.Types.String,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Branch",
    },
    parentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Parent",
    },
    adminId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Admin",
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        this.status = enums_1.StudentStatus.DROPOUT;
    }
    else if (this.graduated) {
        this.status = enums_1.StudentStatus.GRADUATED;
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
    this.status = enums_1.StudentStatus.DROPOUT;
    // Log the action
    await mongoose_1.default.models.Log.create({
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
    this.status = enums_1.StudentStatus.GRADUATED;
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
        status: { $in: [enums_1.StudentStatus.ACTIVE, enums_1.StudentStatus.PENDING] },
    });
};
/**
 * Get students by status
 */
StudentSchema.statics.getByStatus = function (status) {
    return this.find({ status }).populate("branchId parentId");
};
exports.default = mongoose_1.default.model("Student", StudentSchema);
