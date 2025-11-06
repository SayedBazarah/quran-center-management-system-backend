import type { Request, Response, NextFunction } from "express";

const DOT_INDEX = /\.([0-9]+)$/;
const BRACKET_INDEX = /\[([0-9]+)\]$/;

export function normalizeFormDataArrays(fields?: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.body || typeof req.body !== "object") return next();
    const groups = new Map<string, Map<number, unknown>>();
    const setGrouped = (root: string, index: number, value: unknown) => {
      if (fields && !fields.includes(root)) return;
      if (!groups.has(root)) groups.set(root, new Map());
      groups.get(root)!.set(index, value);
    };
    for (const [key, value] of Object.entries(req.body)) {
      let m = key.match(DOT_INDEX) || key.match(BRACKET_INDEX);
      if (m) {
        const idx = Number(m[1]);
        const root = key.replace(DOT_INDEX, "").replace(BRACKET_INDEX, "");
        setGrouped(root, idx, value);
      }
    }
    for (const [root, map] of groups) {
      const arr: unknown[] = [];
      const idxs = [...map.keys()].sort((a, b) => a - b);
      for (const i of idxs) arr.push(map.get(i));
      (req.body as any)[root] = arr;
    }
    for (const key of Object.keys(req.body)) {
      if (DOT_INDEX.test(key) || BRACKET_INDEX.test(key))
        delete (req.body as any)[key];
    }
    next();
  };
}
