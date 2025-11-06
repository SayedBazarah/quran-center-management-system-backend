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
exports.LogAction = void 0;
// src/models/EnrollmentLog.ts
const mongoose_1 = __importStar(require("mongoose"));
var LogAction;
(function (LogAction) {
    LogAction["CREATE"] = "create";
    LogAction["UPDATE"] = "update";
    LogAction["STATUS_CHANGE"] = "status-change";
    LogAction["DELETE"] = "delete";
    LogAction["ENROLL"] = "enroll";
    LogAction["UNENROLL"] = "unenroll";
    LogAction["SYSTEM"] = "system";
})(LogAction || (exports.LogAction = LogAction = {}));
const ILogSchema = new mongoose_1.Schema({
    action: {
        type: String,
        enum: [
            "create",
            "update",
            "status-change",
            "delete",
            "enroll",
            "unenroll",
        ],
    },
    changes: {
        type: [
            {
                field: {
                    type: String,
                },
                from: {
                    type: String,
                },
                to: {
                    type: String,
                },
            },
        ],
        default: [],
    },
    note: {
        type: String,
    },
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Student",
        required: [true, "Student is required"],
        index: true,
    },
    enrollmentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Enrollment",
        index: true,
    },
    adminId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Admin",
        required: [true, "Admin is required"],
        index: true,
    },
}, {
    timestamps: true,
    collection: "enrollment_logs",
});
// Useful compound indexes
ILogSchema.index({ studentId: 1, enrollmentId: 1, createdAt: -1 });
ILogSchema.index({ adminId: 1, createdAt: -1 });
exports.default = mongoose_1.default.model("Log", ILogSchema);
