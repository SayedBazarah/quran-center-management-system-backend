import mongoose, { Schema, Document } from "mongoose";
import { IAdmin } from "./admin";
import { ITeacher } from "./teacher";
import { IStudent } from "./student";
import { ITimestamps } from "@/types/interfaces";

/**
 * Branch Interface
 */
export interface IBranch extends Document, ITimestamps {
  name: string;
  address?: string;
  phone?: string;
  isActive: boolean;
}

/**
 * Branch Schema
 */
const BranchSchema = new Schema<IBranch>(
  {
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
  },
  {
    timestamps: true,
    collection: "branches",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

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
    (mongoose.models.Admin as mongoose.Model<IAdmin>).countDocuments({
      branchId: this._id,
    }),
    (mongoose.models.Teacher as mongoose.Model<ITeacher>).countDocuments({
      branchId: this._id,
    }),
    (mongoose.models.Student as mongoose.Model<IStudent>).countDocuments({
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

export default mongoose.model<IBranch>("Branch", BranchSchema);
