"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPermissions = seedPermissions;
// src/bootstrap/seedPermissions.ts
const models_1 = require("../models");
const permissionSeeds_1 = require("./permissionSeeds");
async function seedPermissions() {
    const codes = [];
    for (const p of permissionSeeds_1.PERMISSION_SEEDS) {
        const doc = await models_1.Permission.findOneAndUpdate({ code: p.code }, { $set: { name: p.name, order: p.order, description: p.description } }, { new: true, upsert: true, setDefaultsOnInsert: true });
        codes.push(doc.code);
    }
    return codes;
}
