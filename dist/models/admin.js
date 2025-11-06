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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const enums_1 = require("../types/enums");
/**
 * Admin Schema
 */
const AdminSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Admin name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple null values
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
        required: [true, "National ID is required"],
        unique: true,
        trim: true,
        minlength: [14, "National ID must be at least 14 characters"],
    },
    nationalIdImg: {
        type: String,
        trim: true,
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        lowercase: true,
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [30, "Username cannot exceed 30 characters"],
        match: [
            /^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers, and underscores",
        ],
    },
    password: {
        type: String,
        minlength: [8, "Password must be at least 8 characters"],
        select: false, // Don't return password by default
    },
    gender: {
        type: String,
        enum: {
            values: Object.values(enums_1.Gender),
            message: "{VALUE} is not a valid gender",
        },
    },
    // Relations
    roleId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Role",
    },
    branchIds: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Branch",
        },
    ],
}, {
    timestamps: true,
    collection: "admins",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// ============================================================================
// INDEXES
// ============================================================================
AdminSchema.index({ username: 1 });
AdminSchema.index({ roleId: 1, branchIds: 1 });
// ============================================================================
// VIRTUALS - Reverse Populate
// ============================================================================
AdminSchema.virtual("createdStudents", {
    ref: "Student",
    localField: "_id",
    foreignField: "adminId",
    justOne: false,
});
AdminSchema.virtual("acceptedStudents", {
    ref: "Student",
    localField: "_id",
    foreignField: "acceptedById",
    justOne: false,
});
AdminSchema.virtual("firedStudents", {
    ref: "Student",
    localField: "_id",
    foreignField: "firedById",
    justOne: false,
});
AdminSchema.virtual("payments", {
    ref: "Payment",
    localField: "_id",
    foreignField: "adminId",
    justOne: false,
});
AdminSchema.virtual("enrollments", {
    ref: "Enrollment",
    localField: "_id",
    foreignField: "adminId",
    justOne: false,
});
AdminSchema.virtual("enrollmentLogs", {
    ref: "EnrollmentLog",
    localField: "_id",
    foreignField: "adminId",
    justOne: false,
});
// ============================================================================
// MIDDLEWARE
// ============================================================================
/**
 * Pre-save: Hash password before saving
 */
AdminSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) {
        return next();
    }
    try {
        const salt = await bcryptjs_1.default.genSalt(12);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
/**
 * Pre-save: Validate username uniqueness case-insensitively
 */
AdminSchema.pre("save", async function (next) {
    if (!this.isModified("username")) {
        return next();
    }
    try {
        const existingAdmin = await mongoose_1.default.models.Admin.findOne({
            username: new RegExp(`^${this.username}$`, "i"),
            _id: { $ne: this._id },
        });
        if (existingAdmin) {
            throw new Error("Username already exists");
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
// ============================================================================
// METHODS
// ============================================================================
/**
 * Compare password for authentication
 */
AdminSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password)
        return false;
    return await bcryptjs_1.default.compare(candidatePassword, this.password);
};
/**
 * Check if admin has specific permission
 */
AdminSchema.methods.hasPermission = async function (permissionCode) {
    try {
        const admin = await this.populate({
            path: "roleId",
            populate: {
                path: "permissions",
                match: { code: permissionCode },
            },
        });
        return admin.roleId?.permissions?.length > 0;
    }
    catch (error) {
        return false;
    }
};
// ============================================================================
// STATIC METHODS
// ============================================================================
/**
 * Find admin by username or email
 */
AdminSchema.statics.findByCredentials = function (identifier) {
    return this.findOne({
        $or: [
            { username: identifier.toLowerCase() },
            { email: identifier.toLowerCase() },
        ],
    }).select("+password");
};
/**
 * Get admins by branch
 */
AdminSchema.statics.findByBranch = function (branchId) {
    return this.find({ branchId }).populate("roleId branchIds");
};
exports.default = mongoose_1.default.model("Admin", AdminSchema);
