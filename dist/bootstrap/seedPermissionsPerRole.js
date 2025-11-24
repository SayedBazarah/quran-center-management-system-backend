"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSuperAdminPermissions = seedSuperAdminPermissions;
const permissionSeeds_1 = require("./permissionSeeds"); // your enum
const models_1 = require("../models");
function toSchemaCode(code) {
    // convert 'create-admin' -> 'CREATE_ADMIN'
    return code.toUpperCase().replace(/-/g, "_");
}
async function seedSuperAdminPermissions() {
    const role = await models_1.Role.findOneAndUpdate({ name: process.env.SUPER_ROLE_NAME || "مدير النظام" }, {
        $set: {
            name: process.env.SUPER_ROLE_NAME || "مدير النظام",
            isSystem: true,
        },
    }, { new: true, upsert: true, setDefaultsOnInsert: true });
    const codes = Object.values(permissionSeeds_1.GlobalPermissionCode).map(toSchemaCode);
    // Use your static bulk assign
    await models_1.Permission.assignToRole(role._id, codes);
    // Optionally update 'name' field for each code
    await models_1.Permission.bulkWrite(codes.map((code) => ({
        updateOne: {
            filter: { roleId: role._id, code },
            update: { $set: { name: code.replace(/_/g, " ").toLowerCase() } },
        },
    })));
}
