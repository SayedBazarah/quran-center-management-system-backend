// src/bootstrap/seedPermissionsPerRole.ts
import { Types } from "mongoose";
import { GlobalPermissionCode } from "./permissionSeeds"; // your enum
import { Permission, Role } from "@/models";
function toSchemaCode(code: string) {
  // convert 'create-admin' -> 'CREATE_ADMIN'
  return code.toUpperCase().replace(/-/g, "_");
}

export async function seedSuperAdminPermissions(): Promise<void> {
  const role = await Role.findOneAndUpdate(
    { name: process.env.SUPER_ROLE_NAME || "مدير النظام" },
    {
      $set: {
        name: process.env.SUPER_ROLE_NAME || "مدير النظام",
        isSystem: true,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const codes = Object.values(GlobalPermissionCode).map(toSchemaCode);

  // Use your static bulk assign
  await (Permission as any).assignToRole(role._id as Types.ObjectId, codes);

  // Optionally update 'name' field for each code
  await Permission.bulkWrite(
    codes.map((code) => ({
      updateOne: {
        filter: { roleId: role._id, code },
        update: { $set: { name: code.replace(/_/g, " ").toLowerCase() } },
      },
    }))
  );
}
