import { ITimestamps } from "@/types/interfaces";
import mongoose, { Schema, Document } from "mongoose";
import { IEnrollment } from "./enrollment";

/**
 * Course Interface
 */
export interface ICourse extends Document, ITimestamps {
  name: string;
  duration?: number; // in days
  price?: number;
  order?: number;
  description?: string;
  isActive: boolean;
}

/**
 * Course Schema
 */
const CourseSchema = new Schema<ICourse>(
  {
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
  },
  {
    timestamps: true,
    collection: "courses",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

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
  return await (
    mongoose.models.Enrollment as mongoose.Model<IEnrollment>
  ).countDocuments({
    courseId: this._id,
  });
};

/**
 * Get active enrollments
 */
CourseSchema.methods.getActiveEnrollments = async function () {
  return await (
    mongoose.models.Enrollment as mongoose.Model<IEnrollment>
  ).countDocuments({
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

export default mongoose.model<ICourse>("Course", CourseSchema);
