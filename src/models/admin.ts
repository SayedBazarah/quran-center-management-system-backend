import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from "bcryptjs";

import { Gender } from "@/types/enums";
import {
  IContactInfo,
  IIdentityDocument,
  ITimestamps,
  IUserCredentials,
} from "@/types/interfaces";

/**
 * Admin Interface
 */
export interface IAdmin
  extends Document,
    ITimestamps,
    IContactInfo,
    IIdentityDocument,
    IUserCredentials {
  name: string;
  avatar?: string;
  gender?: Gender;

  // Relations
  roleId?: Types.ObjectId;
  branchIds?: Types.ObjectId[];

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  hasPermission(permissionCode: string): Promise<boolean>;
}

/**
 * Admin Schema
 */
const AdminSchema = new Schema<IAdmin>(
  {
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
        values: Object.values(Gender),
        message: "{VALUE} is not a valid gender",
      },
    },

    // Relations
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
    branchIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Branch",
      },
    ],
  },
  {
    timestamps: true,
    collection: "admins",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

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
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
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
    const existingAdmin = await (
      mongoose.models.Admin as mongoose.Model<IAdmin>
    ).findOne({
      username: new RegExp(`^${this.username}$`, "i"),
      _id: { $ne: this._id },
    });

    if (existingAdmin) {
      throw new Error("Username already exists");
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

// ============================================================================
// METHODS
// ============================================================================

/**
 * Compare password for authentication
 */
AdminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Check if admin has specific permission
 */
AdminSchema.methods.hasPermission = async function (
  permissionCode: string
): Promise<boolean> {
  try {
    const admin = await this.populate({
      path: "roleId",
      populate: {
        path: "permissions",
        match: { code: permissionCode },
      },
    });

    return admin.roleId?.permissions?.length > 0;
  } catch (error) {
    return false;
  }
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find admin by username or email
 */
AdminSchema.statics.findByCredentials = function (identifier: string) {
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
AdminSchema.statics.findByBranch = function (branchId: Types.ObjectId) {
  return this.find({ branchId }).populate("roleId branchIds");
};

export default mongoose.model<IAdmin>("Admin", AdminSchema);
