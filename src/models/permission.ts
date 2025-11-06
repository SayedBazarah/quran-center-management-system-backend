import mongoose, { Schema, Document, Types } from "mongoose";

/**
 * Permission Interface
 */
export interface IPermission extends Document {
  code: string;
  name: string;
  roleId: Types.ObjectId;
}

/**
 * Permission Schema
 */
const PermissionSchema = new Schema<IPermission>(
  {
    code: {
      type: String,
      required: [true, "Permission code is required"],
      uppercase: true,
      trim: true,
      match: [/^[A-Z_]+$/, "..."],
    },
    name: {
      type: String,
      required: [true, "Permission name is required"],
      trim: true,
    },
  },
  {
    timestamps: false,
    collection: "permissions",
  }
);

// ============================================================================
// INDEXES
// ============================================================================
// PermissionSchema.index({ roleId: 1 });
PermissionSchema.index({ code: 1 }, { unique: true });

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Get permissions by role
 */
PermissionSchema.statics.findByRole = function (roleId: Types.ObjectId) {
  return this.find({ roleId }).sort({ name: 1 });
};

/**
 * Bulk assign permissions to role
 */
PermissionSchema.statics.assignToRole = async function (
  roleId: Types.ObjectId,
  permissionCodes: string[]
) {
  const operations = permissionCodes.map((code) => ({
    updateOne: {
      filter: { code, roleId },
      update: { $setOnInsert: { code, roleId } },
      upsert: true,
    },
  }));

  return this.bulkWrite(operations);
};

/**
 * Remove permission from role
 */
PermissionSchema.statics.removeFromRole = function (
  roleId: Types.ObjectId,
  permissionCode: string
) {
  return this.deleteOne({ roleId, code: permissionCode });
};
PermissionSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
  },
});

PermissionSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
  },
});

export default mongoose.model<IPermission>("Permission", PermissionSchema);
