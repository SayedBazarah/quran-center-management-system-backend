// src/models/EnrollmentLog.ts
import mongoose, { Schema } from "mongoose";
export var LogAction;
(function (LogAction) {
    LogAction["CREATE"] = "create";
    LogAction["UPDATE"] = "update";
    LogAction["STATUS_CHANGE"] = "status-change";
    LogAction["DELETE"] = "delete";
    LogAction["ENROLL"] = "enroll";
    LogAction["UNENROLL"] = "unenroll";
    LogAction["SYSTEM"] = "system";
})(LogAction || (LogAction = {}));
const ILogSchema = new Schema({
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
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: [true, "Student is required"],
        index: true,
    },
    enrollmentId: {
        type: Schema.Types.ObjectId,
        ref: "Enrollment",
        index: true,
    },
    adminId: {
        type: Schema.Types.ObjectId,
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
export default mongoose.model("Log", ILogSchema);
//# sourceMappingURL=log.js.map