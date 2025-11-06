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
    const role = await models_1.Role.findOneAndUpdate({ _id: env_1.env.admin.roleId }, {
        $set: { name: env_1.env.admin.roleName, isSystem: true, permissions: permIds },
    }, { new: true, upsert: true, setDefaultsOnInsert: true });
    return { roleId: role._id };
}
async function seedSuperAdminUser(roleId) {
    let admin = await models_1.Admin.findOne({ username: env_1.env.admin.username }).select("+password");
    if (!admin) {
        await models_1.Admin.create({
            id: env_1.env.admin.id,
            _id: env_1.env.admin.id,
            name: "Super Admin",
            username: env_1.env.admin.username,
            email: env_1.env.admin.email,
            phone: env_1.env.admin.phone,
            nationalId: env_1.env.admin.nationalId,
            password: env_1.env.admin.password,
            gender: "male",
            nationalIdImg: "https://multisystem.com",
            roleId,
            isActive: true,
            isSystem: true,
        });
        return;
    }
    else {
        const branches = await models_1.Branch.find({}).select("_id");
        const branchIds = branches.map((branch) => branch._id);
        console.log({
            branchIds,
            roleId,
        });
        await models_1.Admin.findOneAndUpdate({ _id: admin._id }, { $set: { isActive: true, isSystem: true, roleId, branchIds } });
    }
    // Ensure role and flags are correct; only set password if missing
    const setOps = {
        roleId,
        isActive: true,
        isSystem: true,
    };
    if (!admin.password) {
        setOps.password = await bcryptjs_1.default.hash(env_1.env.admin.password, 12);
    }
    await models_1.Admin.updateOne({ _id: admin._id }, { $set: setOps });
}
async function seedSuperAdmin() {
    await models_1.Permission.init(); // ensure indexes before upserts
    await seedPermissions();
    const { roleId } = await seedSuperAdminRole();
    await seedSuperAdminUser(roleId);
}
