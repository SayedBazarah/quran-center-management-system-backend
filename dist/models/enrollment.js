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
// src/models/Enrollment.ts
const enums_1 = require("../types/enums");
const mongoose_1 = __importStar(require("mongoose"));
const EnrollmentSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: (0, enums_1.getEnumValues)(enums_1.EnrollmentStatus),
        default: enums_1.EnrollmentStatus.PENDING,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
        required: [true, "Course is required"],
        index: true,
    },
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Student",
        required: [true, "Student is required"],
        index: true,
    },
    teacherId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Teacher",
        index: true,
    },
    adminId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Admin",
        index: true,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Admin",
        index: true,
    },
    // Admin only
    rejectionReason: {
        type: mongoose_1.Schema.Types.String,
        maxlength: [200, "Address cannot exceed 200 characters"],
    },
    rejectedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Admin",
        index: true,
    },
    rejectedAt: {
        type: Date,
    },
    acceptedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
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
    return started && notEnded && this.status === enums_1.EnrollmentStatus.ACTIVE;
};
EnrollmentSchema.methods.close = async function (status = enums_1.EnrollmentStatus.GRADUATED) {
    this.status = status;
    this.endDate = new Date();
    await this.save();
};
exports.default = mongoose_1.default.model("Enrollment", EnrollmentSchema);
