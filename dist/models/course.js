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
 * Course Schema
 */
const CourseSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Course name is required"],
        trim: true,
        unique: true,
        minlength: [3, "Course name must be at least 3 characters"],
        maxlength: [100, "Course name cannot exceed 100 characters"],
    },
    duration: {
        type: Number,
        min: [1, "Duration must be at least 1 day"],
        max: [365, "Duration cannot exceed 365 days"],
    },
    price: {
        type: Number,
        min: [0, "Price cannot be negative"],
        default: 0,
    },
    order: {
        type: Number,
        min: [0, "ترتيب الدورة"],
        default: 0,
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, "Description cannot exceed 500 characters"],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    collection: "courses",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// ============================================================================
// VIRTUALS
// ============================================================================
CourseSchema.virtual("enrollments", {
    ref: "Enrollment",
    localField: "_id",
    foreignField: "courseId",
    justOne: false,
});
// ============================================================================
// METHODS
// ============================================================================
/**
 * Get total enrolled students
 */
CourseSchema.methods.getTotalEnrollments = async function () {
    return await mongoose_1.default.models.Enrollment.countDocuments({
        courseId: this._id,
    });
};
/**
 * Get active enrollments
 */
CourseSchema.methods.getActiveEnrollments = async function () {
    return await mongoose_1.default.models.Enrollment.countDocuments({
        courseId: this._id,
        status: "active",
    });
};
// ============================================================================
// STATIC METHODS
// ============================================================================
/**
 * Get active courses
 */
CourseSchema.statics.getActiveCourses = function () {
    return this.find({ isActive: true }).sort({ name: 1 });
};
exports.default = mongoose_1.default.model("Course", CourseSchema);
