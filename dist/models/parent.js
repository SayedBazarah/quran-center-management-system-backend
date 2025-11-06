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
 * Parent Schema
 */
const ParentSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Parent name is required"],
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
    },
    nationalId: {
        type: String,
        required: [true, "National ID is required"],
        unique: true,
        trim: true,
    },
    nationalIdImg: {
        type: String,
        required: [true, "National ID image is required"],
        trim: true,
    },
    birthDate: {
        type: Date,
    },
    gender: {
        type: String,
        enum: Object.values(enums_1.Gender),
    },
    relationship: {
        type: String,
        enum: Object.values(enums_1.ParentRelationship),
        default: enums_1.ParentRelationship.FATHER,
    },
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Student",
        unique: true,
        sparse: true,
    },
}, {
    timestamps: true,
    collection: "parents",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// ============================================================================
// VIRTUALS
// ============================================================================
ParentSchema.virtual("student", {
    ref: "Student",
    localField: "studentId",
    foreignField: "_id",
    justOne: true,
});
exports.default = mongoose_1.default.model("Parent", ParentSchema);
