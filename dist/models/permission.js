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
 * Permission Schema
 */
const PermissionSchema = new mongoose_1.Schema({
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
}, {
    timestamps: false,
    collection: "permissions",
});
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
PermissionSchema.statics.findByRole = function (roleId) {
    return this.find({ roleId }).sort({ name: 1 });
};
/**
 * Bulk assign permissions to role
 */
PermissionSchema.statics.assignToRole = async function (roleId, permissionCodes) {
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
PermissionSchema.statics.removeFromRole = function (roleId, permissionCode) {
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
exports.default = mongoose_1.default.model("Permission", PermissionSchema);
