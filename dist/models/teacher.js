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
// import { ITimestamps, IContactInfo, IIdentityDocument, IUserCredentials } from '@types/interfaces';
const enums_1 = require("../types/enums");
/**
 * Teacher Schema
 */
const TeacherSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Teacher name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email",
        ],
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,
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
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [3, "Username must be at least 3 characters"],
    },
    gender: {
        type: String,
        enum: Object.values(enums_1.Gender),
    },
    password: {
        type: String,
        minlength: [8, "Password must be at least 8 characters"],
        select: false,
    },
    branchId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Branch",
        required: [true, "Branch ID is required"],
        index: true,
    },
}, {
    timestamps: true,
    collection: "teachers",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// ============================================================================
// VIRTUALS
// ============================================================================
TeacherSchema.virtual("enrollments", {
    ref: "Enrollment",
    localField: "_id",
    foreignField: "teacherId",
    justOne: false,
});
// ============================================================================
// MIDDLEWARE
// ============================================================================
TeacherSchema.pre("save", async function (next) {
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
// ============================================================================
// METHODS
// ============================================================================
TeacherSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password)
        return false;
    return await bcryptjs_1.default.compare(candidatePassword, this.password);
};
exports.default = mongoose_1.default.model("Teacher", TeacherSchema);
