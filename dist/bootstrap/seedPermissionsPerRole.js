import { GlobalPermissionCode } from "./permissionSeeds"; // your enum
import { Permission, Role } from "@/models";
function toSchemaCode(code) {
    // convert 'create-admin' -> 'CREATE_ADMIN'
    return code.toUpperCase().replace(/-/g, "_");
}
export async function seedSuperAdminPermissions() {
    const role = await Role.findOneAndUpdate({ name: process.env.SUPER_ROLE_NAME || "Super Admin" }, {
        $set: {
            name: process.env.SUPER_ROLE_NAME || "Super Admin",
            isSystem: true,
        },
    }, { new: true, upsert: true, setDefaultsOnInsert: true });
    const codes = Object.values(GlobalPermissionCode).map(toSchemaCode);
    // Use your static bulk assign
    await Permission.assignToRole(role._id, codes);
    // Optionally update 'name' field for each code
    await Permission.bulkWrite(codes.map((code) => ({
        updateOne: {
            filter: { roleId: role._id, code },
            update: { $set: { name: code.replace(/_/g, " ").toLowerCase() } },
        },
    })));
}
//# sourceMappingURL=seedPermissionsPerRole.js.map