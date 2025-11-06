"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPermissions = seedPermissions;
exports.seedSuperAdminRole = seedSuperAdminRole;
exports.seedSuperAdminUser = seedSuperAdminUser;
exports.seedSuperAdmin = seedSuperAdmin;
// src/bootstrap/seedSuperAdmin.ts
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const permissionSeeds_1 = require("./permissionSeeds");
const models_1 = require("../models");
const env_1 = require("../env");
const SUPER_ROLE_NAME = process.env.SUPER_ROLE_NAME || "Super Admin";
const SUPER_ADMIN_USERNAME = process.env.SUPER_ADMIN_USERNAME || "superadmin";
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "superadmin@example.com";
const SUPER_ADMIN_PHONE = process.env.SUPER_ADMIN_PHONE || "0000000000";
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || "ChangeMe!123"; // override in prod
const SUPER_ADMIN_NATIONAL_ID = process.env.SUPER_ADMIN_NATIONAL_ID || "11111111111111"; // override in prod
async function seedPermissions() {
    const codes = [];
    for (const p of permissionSeeds_1.PERMISSION_SEEDS) {
        const doc = await models_1.Permission.findOneAndUpdate({ code: p.code }, { $set: { name: p.name, description: p.description, isSystem: true } }, { new: true, upsert: true, setDefaultsOnInsert: true });
        codes.push(doc.code);
    }
    return codes;
}
async function seedSuperAdminRole() {
    // Get all permission ids
    const allPerms = await models_1.Permission.find({}, { _id: 1 }).lean();
    const permIds = allPerms.map((p) => p._id);
    // Upsert Super Admin role with full permissions
    const role = await models_1.Role.findOneAndUpdate({ name: SUPER_ROLE_NAME }, { $set: { name: SUPER_ROLE_NAME, isSystem: true, permissions: permIds } }, { new: true, upsert: true, setDefaultsOnInsert: true });
    return { roleId: role._id };
}
async function seedSuperAdminUser(roleId) {
    let admin = await models_1.Admin.findOne({ username: SUPER_ADMIN_USERNAME }).select("+password");
    if (!admin) {
        await models_1.Admin.create({
            id: env_1.env.admin.id,
            _id: env_1.env.admin.id,
            name: "Super Admin",
            username: SUPER_ADMIN_USERNAME,
            email: SUPER_ADMIN_EMAIL,
            phone: SUPER_ADMIN_PHONE,
            nationalId: SUPER_ADMIN_NATIONAL_ID,
            password: SUPER_ADMIN_PASSWORD,
            roleId,
            isActive: true,
            isSystem: true,
        });
        return;
    }
    // Ensure role and flags are correct; only set password if missing
    const setOps = {
        roleId,
        isActive: true,
        isSystem: true,
    };
    if (!admin.password) {
        setOps.password = await bcryptjs_1.default.hash(SUPER_ADMIN_PASSWORD, 12);
    }
    await models_1.Admin.updateOne({ _id: admin._id }, { $set: setOps });
}
async function seedSuperAdmin() {
    await models_1.Permission.init(); // ensure indexes before upserts
    await seedPermissions();
    const { roleId } = await seedSuperAdminRole();
    await seedSuperAdminUser(roleId);
}
