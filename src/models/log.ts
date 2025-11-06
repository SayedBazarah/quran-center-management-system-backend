// src/models/EnrollmentLog.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export type FieldChange = {
  field: string;
  from?: string | number | boolean | null;
  to?: string | number | boolean | null;
};

export enum LogAction {
  CREATE = "create",
  UPDATE = "update",
  STATUS_CHANGE = "status-change",
  DELETE = "delete",
  ENROLL = "enroll",
  UNENROLL = "unenroll",
  SYSTEM = "system",
}

export interface ILog extends Document {
  action?: LogAction;
  note?: string;
  studentId: Types.ObjectId;
  enrollmentId?: Types.ObjectId;
  adminId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  changes?: FieldChange[]; // structured diffs
  logs: ILog[];
}

const ILogSchema = new Schema<ILog>(
  {
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
  },
  {
    timestamps: true,
    collection: "enrollment_logs",
  }
);

// Useful compound indexes
ILogSchema.index({ studentId: 1, enrollmentId: 1, createdAt: -1 });
ILogSchema.index({ adminId: 1, createdAt: -1 });

export default mongoose.model<ILog>("Log", ILogSchema);
