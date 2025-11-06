// src/bootstrap/seedPermissions.ts
import { Permission } from "@/models";
import { PERMISSION_SEEDS } from "./permissionSeeds";

export async function seedPermissions(): Promise<string[]> {
  const codes: string[] = [];
  for (const p of PERMISSION_SEEDS) {
    const doc = await Permission.findOneAndUpdate(
      { code: p.code },
      { $set: { name: p.name, description: p.description } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    codes.push(doc.code);
  }
  return codes;
}
