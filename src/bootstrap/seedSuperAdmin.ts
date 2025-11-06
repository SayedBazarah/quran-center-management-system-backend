// src/bootstrap/seedSuperAdmin.ts
import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { PERMISSION_SEEDS } from "./permissionSeeds";
import { Admin, Branch, Permission, Role } from "@/models";
import { env } from "@/env";

export async function seedPermissions(): Promise<string[]> {
  const codes: string[] = [];
  for (const p of PERMISSION_SEEDS) {
    const doc = await Permission.findOneAndUpdate(
      { code: p.code },
      { $set: { name: p.name, description: p.description, isSystem: true } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    codes.push(doc.code);
  }
  return codes;
}

export async function seedSuperAdminRole(): Promise<{
  roleId: Types.ObjectId;
}> {
  // Get all permission ids
  const allPerms = await Permission.find({}, { _id: 1 }).lean();
  const permIds = allPerms.map((p) => p._id);

  // Upsert Super Admin role with full permissions
  const role = await Role.findOneAndUpdate(
    { _id: env.admin.roleId },
    {
      $set: { name: env.admin.roleName, isSystem: true, permissions: permIds },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return { roleId: role._id as Types.ObjectId };
}

export async function seedSuperAdminUser(
  roleId: Types.ObjectId
): Promise<void> {
  let admin = await Admin.findOne({ username: env.admin.username }).select(
    "+password"
  );
  if (!admin) {
    await Admin.create({
      id: env.admin.id,
      _id: env.admin.id,
      name: "Super Admin",
      username: env.admin.username,
      email: env.admin.email,
      phone: env.admin.phone,
      nationalId: env.admin.nationalId,
      password: env.admin.password,
      gender: "male",
      nationalIdImg: "https://multisystem.com",
      roleId,
      isActive: true,
      isSystem: true,
    });
    return;
  } else {
    const branches = await Branch.find({}).select("_id");
    const branchIds = branches.map((branch) => branch._id);
    console.log({
      branchIds,
      roleId,
    });
    await Admin.findOneAndUpdate(
      { _id: admin._id },
      { $set: { isActive: true, isSystem: true, roleId, branchIds } }
    );
  }

  // Ensure role and flags are correct; only set password if missing
  const setOps: Record<string, unknown> = {
    roleId,
    isActive: true,
    isSystem: true,
  };
  if (!admin.password) {
    setOps.password = await bcrypt.hash(env.admin.password, 12);
  }
  await Admin.updateOne({ _id: admin._id }, { $set: setOps });
}

export async function seedSuperAdmin(): Promise<void> {
  await Permission.init(); // ensure indexes before upserts
  await seedPermissions();
  const { roleId } = await seedSuperAdminRole();
  await seedSuperAdminUser(roleId);
}
