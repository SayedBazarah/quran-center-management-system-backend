"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaCategory = void 0;
exports.ensureDir = ensureDir;
exports.initBaseFolders = initBaseFolders;
exports.buildPath = buildPath;
exports.ensureUserFolder = ensureUserFolder;
exports.exists = exists;
exports.saveBuffer = saveBuffer;
exports.saveMulterFile = saveMulterFile;
exports.saveMulterFiles = saveMulterFiles;
exports.removeFile = removeFile;
exports.removeFolder = removeFolder;
exports.listFiles = listFiles;
// src/utils/fileManager.ts
const node_crypto_1 = require("node:crypto");
const promises_1 = require("node:fs/promises");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
var MediaCategory;
(function (MediaCategory) {
    MediaCategory["Admin"] = "admin";
    MediaCategory["Student"] = "student";
    MediaCategory["Teacher"] = "teacher";
})(MediaCategory || (exports.MediaCategory = MediaCategory = {}));
// Configure your media root (relative to process.cwd() by default)
const MEDIA_ROOT = "media";
// Utility logger (replace with your logger)
function logInfo(msg, meta) {
    // eslint-disable-next-line no-console
    console.log(`[file] ${msg}`, meta || {});
}
function logWarn(msg, meta) {
    // eslint-disable-next-line no-console
    console.warn(`[file] ${msg}`, meta || {});
}
function logError(msg, meta) {
    // eslint-disable-next-line no-console
    console.error(`[file] ${msg}`, meta || {});
}
// Ensure a directory exists (recursive, idempotent)
async function ensureDir(dirPath) {
    await (0, promises_1.mkdir)(dirPath, { recursive: true }); // creates parents if missing [web:377][web:371]
    // logInfo("ensureDir", { dirPath });
}
// Initialize base folder structure at app start
async function initBaseFolders() {
    const roots = [
        (0, node_path_1.join)(process.cwd(), MEDIA_ROOT),
        (0, node_path_1.join)(process.cwd(), MEDIA_ROOT, MediaCategory.Admin),
        (0, node_path_1.join)(process.cwd(), MEDIA_ROOT, MediaCategory.Student),
        (0, node_path_1.join)(process.cwd(), MEDIA_ROOT, MediaCategory.Teacher),
    ];
    for (const dir of roots) {
        await ensureDir(dir); // safe to call repeatedly [web:377][web:371]
    }
    // logInfo("initBaseFolders completed", { MEDIA_ROOT, roots });
}
// Build absolute path under MEDIA_ROOT
function buildPath(...segments) {
    return (0, node_path_1.join)(process.cwd(), MEDIA_ROOT, ...segments);
}
// Create a user-specific folder under a category, returns the absolute path
async function ensureUserFolder(category, userId) {
    const dir = buildPath(category, userId);
    await ensureDir(dir);
    return dir;
}
// Check if a path exists with read access
async function exists(path) {
    try {
        await (0, promises_1.access)(path, node_fs_1.constants.F_OK | node_fs_1.constants.R_OK);
        return true;
    }
    catch {
        return false;
    }
}
// Save a single buffer to disk (creates parent folders)
async function saveBuffer(filePath, buffer) {
    await ensureDir((0, node_path_1.dirname)(filePath)); // make parents recursively [web:377][web:371]
    await (0, promises_1.writeFile)(filePath, buffer);
    logInfo("saveBuffer", { filePath, bytes: buffer.length });
    return filePath;
}
// Save a Multer single file to disk (uses file.buffer)
// helper: short random id fallback
function shortId() {
    try {
        return (0, node_crypto_1.randomUUID)().replace(/-/g, "").slice(0, 12);
    }
    catch {
        return Math.random().toString(36).slice(2, 10);
    }
}
async function saveMulterFile(category, file, options) {
    if (!file || !file.buffer) {
        throw new Error("Invalid Multer file: missing buffer");
    }
    const ext = (0, node_path_1.extname)(file.originalname) || guessExtFromMime(file.mimetype); // preserve or infer extension [web:377]
    // If no filename provided, generate random; otherwise sanitize the provided/original name (without path traversal)
    const base = options?.filename && options.filename.trim().length > 0
        ? sanitizeFileName(options.filename)
        : `${shortId()}`; // random base name when missing
    // Ensure we only append the extension once
    const finalName = base.toLowerCase().endsWith(ext.toLowerCase())
        ? base
        : `${base}${ext}`;
    const targetDir = buildPath(category, ...(options?.userId ? [options.userId] : []), ...(options?.subfolder ? [options.subfolder] : []));
    await ensureDir(targetDir); // mkdir -p behavior [web:371]
    const targetPath = (0, node_path_1.join)(targetDir, finalName);
    await (0, promises_1.writeFile)(targetPath, file.buffer); // async, non-blocking write [web:377]
    logInfo("saveMulterFile", {
        category,
        targetPath,
        size: file.size,
        mimetype: file.mimetype,
    });
    return { path: targetPath, filename: finalName };
}
// Save multiple Multer files at once
async function saveMulterFiles(category, files, options) {
    if (!Array.isArray(files) || files.length === 0)
        return [];
    const saved = [];
    const targetDir = buildPath(category, ...(options?.userId ? [options.userId] : []), ...(options?.subfolder ? [options?.subfolder] : []));
    await ensureDir(targetDir);
    for (const file of files) {
        const ext = (0, node_path_1.extname)(file.originalname) || guessExtFromMime(file.mimetype);
        const safeName = sanitizeFileName(file.originalname);
        const targetPath = (0, node_path_1.join)(targetDir, safeName.endsWith(ext) ? safeName : `${safeName}${ext}`);
        await (0, promises_1.writeFile)(targetPath, file.buffer);
        saved.push(targetPath);
        logInfo("saveMulterFiles:item", {
            targetPath,
            size: file.size,
            mimetype: file.mimetype,
        });
    }
    logInfo("saveMulterFiles:done", { count: saved.length, dir: targetDir });
    return saved;
}
// Remove a single file, ignore if missing
async function removeFile(filePath) {
    try {
        if (!(await exists(filePath))) {
            logWarn("removeFile:missing", { filePath });
            return false;
        }
        await (0, promises_1.rm)(filePath, { force: true }); // force ignores missing entries [web:377]
        logInfo("removeFile", { filePath });
        return true;
    }
    catch (err) {
        logError("removeFile:error", { filePath, error: err.message });
        return false;
    }
}
// Remove a directory recursively (safe, logs), ignore if missing
async function removeFolder(dirPath) {
    try {
        // Check existence to provide a clean log
        if (!(await exists(dirPath))) {
            logWarn("removeFolder:missing", { dirPath });
            return false;
        }
        await (0, promises_1.rm)(dirPath, { recursive: true, force: true }); // modern Node: rm replaces rmdir [web:372][web:384]
        logInfo("removeFolder", { dirPath });
        return true;
    }
    catch (err) {
        logError("removeFolder:error", { dirPath, error: err.message });
        return false;
    }
}
// List files in a directory (non-recursive)
async function listFiles(dirPath) {
    try {
        const items = await (0, promises_1.readdir)(dirPath, { withFileTypes: true });
        const files = items.filter((d) => d.isFile()).map((d) => d.name);
        logInfo("listFiles", { dirPath, count: files.length });
        return files;
    }
    catch (err) {
        logWarn("listFiles:error-or-missing", {
            dirPath,
            error: err.message,
        });
        return [];
    }
}
// Helpers
// Guess extension from MIME if originalname has none
function guessExtFromMime(mime) {
    if (!mime)
        return "";
    const map = {
        "image/jpeg": ".jpg",
        "image/jpg": ".jpg",
        "image/png": ".png",
        "image/gif": ".gif",
        "image/webp": ".webp",
        "application/pdf": ".pdf",
    };
    return map[mime] || "";
}
// Basic filename sanitizer: strips directories, keeps base, replaces spaces
function sanitizeFileName(name) {
    const base = (0, node_path_1.basename)(name).replace(/\s+/g, "-");
    // Remove any path traversal or dangerous chars
    return base.replace(/[^a-zA-Z0-9._-]/g, "");
}
