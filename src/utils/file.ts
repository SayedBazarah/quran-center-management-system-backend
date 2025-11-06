// src/utils/fileManager.ts
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, access, rm, readdir } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { join, dirname, extname, basename } from "node:path";

export enum MediaCategory {
  Admin = "admin",
  Student = "student",
  Teacher = "teacher",
}

export type MulterSingle = Express.Multer.File;
export type MulterMany = Express.Multer.File[];

// Configure your media root (relative to process.cwd() by default)
const MEDIA_ROOT = "media";

// Utility logger (replace with your logger)
function logInfo(msg: string, meta?: Record<string, unknown>) {
  // eslint-disable-next-line no-console
  console.log(`[file] ${msg}`, meta || {});
}
function logWarn(msg: string, meta?: Record<string, unknown>) {
  // eslint-disable-next-line no-console
  console.warn(`[file] ${msg}`, meta || {});
}
function logError(msg: string, meta?: Record<string, unknown>) {
  // eslint-disable-next-line no-console
  console.error(`[file] ${msg}`, meta || {});
}

// Ensure a directory exists (recursive, idempotent)
export async function ensureDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true }); // creates parents if missing [web:377][web:371]
  // logInfo("ensureDir", { dirPath });
}

// Initialize base folder structure at app start
export async function initBaseFolders(): Promise<void> {
  const roots = [
    join(process.cwd(), MEDIA_ROOT),
    join(process.cwd(), MEDIA_ROOT, MediaCategory.Admin),
    join(process.cwd(), MEDIA_ROOT, MediaCategory.Student),
    join(process.cwd(), MEDIA_ROOT, MediaCategory.Teacher),
  ];
  for (const dir of roots) {
    await ensureDir(dir); // safe to call repeatedly [web:377][web:371]
  }
  // logInfo("initBaseFolders completed", { MEDIA_ROOT, roots });
}

// Build absolute path under MEDIA_ROOT
export function buildPath(...segments: string[]): string {
  return join(process.cwd(), MEDIA_ROOT, ...segments);
}

// Create a user-specific folder under a category, returns the absolute path
export async function ensureUserFolder(
  category: MediaCategory,
  userId: string
): Promise<string> {
  const dir = buildPath(category, userId);
  await ensureDir(dir);
  return dir;
}

// Check if a path exists with read access
export async function exists(path: string): Promise<boolean> {
  try {
    await access(path, fsConstants.F_OK | fsConstants.R_OK);
    return true;
  } catch {
    return false;
  }
}

// Save a single buffer to disk (creates parent folders)
export async function saveBuffer(
  filePath: string,
  buffer: Buffer
): Promise<string> {
  await ensureDir(dirname(filePath)); // make parents recursively [web:377][web:371]
  await writeFile(filePath, buffer);
  logInfo("saveBuffer", { filePath, bytes: buffer.length });
  return filePath;
}

// Save a Multer single file to disk (uses file.buffer)
// helper: short random id fallback
function shortId() {
  try {
    return randomUUID().replace(/-/g, "").slice(0, 12);
  } catch {
    return Math.random().toString(36).slice(2, 10);
  }
}

export async function saveMulterFile(
  category: MediaCategory,
  file: MulterSingle,
  options?: { userId?: string; filename?: string; subfolder?: string }
): Promise<{ path: string; filename: string }> {
  if (!file || !file.buffer) {
    throw new Error("Invalid Multer file: missing buffer");
  }

  const ext = extname(file.originalname) || guessExtFromMime(file.mimetype); // preserve or infer extension [web:377]
  // If no filename provided, generate random; otherwise sanitize the provided/original name (without path traversal)
  const base =
    options?.filename && options.filename.trim().length > 0
      ? sanitizeFileName(options.filename)
      : `${shortId()}`; // random base name when missing

  // Ensure we only append the extension once
  const finalName = base.toLowerCase().endsWith(ext.toLowerCase())
    ? base
    : `${base}${ext}`;

  const targetDir = buildPath(
    category,
    ...(options?.userId ? [options.userId] : []),
    ...(options?.subfolder ? [options.subfolder] : [])
  );
  await ensureDir(targetDir); // mkdir -p behavior [web:371]

  const targetPath = join(targetDir, finalName);
  await writeFile(targetPath, file.buffer); // async, non-blocking write [web:377]

  logInfo("saveMulterFile", {
    category,
    targetPath,
    size: file.size,
    mimetype: file.mimetype,
  });

  return { path: targetPath, filename: finalName };
}

// Save multiple Multer files at once
export async function saveMulterFiles(
  category: MediaCategory,
  files: MulterMany,
  options?: { userId?: string; subfolder?: string }
): Promise<string[]> {
  if (!Array.isArray(files) || files.length === 0) return [];
  const saved: string[] = [];
  const targetDir = buildPath(
    category,
    ...(options?.userId ? [options.userId] : []),
    ...(options?.subfolder ? [options?.subfolder] : [])
  );
  await ensureDir(targetDir);
  for (const file of files) {
    const ext = extname(file.originalname) || guessExtFromMime(file.mimetype);
    const safeName = sanitizeFileName(file.originalname);
    const targetPath = join(
      targetDir,
      safeName.endsWith(ext) ? safeName : `${safeName}${ext}`
    );
    await writeFile(targetPath, file.buffer);
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
export async function removeFile(filePath: string): Promise<boolean> {
  try {
    if (!(await exists(filePath))) {
      logWarn("removeFile:missing", { filePath });
      return false;
    }
    await rm(filePath, { force: true }); // force ignores missing entries [web:377]
    logInfo("removeFile", { filePath });
    return true;
  } catch (err) {
    logError("removeFile:error", { filePath, error: (err as Error).message });
    return false;
  }
}

// Remove a directory recursively (safe, logs), ignore if missing
export async function removeFolder(dirPath: string): Promise<boolean> {
  try {
    // Check existence to provide a clean log
    if (!(await exists(dirPath))) {
      logWarn("removeFolder:missing", { dirPath });
      return false;
    }
    await rm(dirPath, { recursive: true, force: true }); // modern Node: rm replaces rmdir [web:372][web:384]
    logInfo("removeFolder", { dirPath });
    return true;
  } catch (err) {
    logError("removeFolder:error", { dirPath, error: (err as Error).message });
    return false;
  }
}

// List files in a directory (non-recursive)
export async function listFiles(dirPath: string): Promise<string[]> {
  try {
    const items = await readdir(dirPath, { withFileTypes: true });
    const files = items.filter((d) => d.isFile()).map((d) => d.name);
    logInfo("listFiles", { dirPath, count: files.length });
    return files;
  } catch (err) {
    logWarn("listFiles:error-or-missing", {
      dirPath,
      error: (err as Error).message,
    });
    return [];
  }
}

// Helpers

// Guess extension from MIME if originalname has none
function guessExtFromMime(mime: string): string {
  if (!mime) return "";
  const map: Record<string, string> = {
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
function sanitizeFileName(name: string): string {
  const base = basename(name).replace(/\s+/g, "-");
  // Remove any path traversal or dangerous chars
  return base.replace(/[^a-zA-Z0-9._-]/g, "");
}
