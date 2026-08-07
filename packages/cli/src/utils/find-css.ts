import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const IGNORED = new Set([
  "node_modules",
  "dist",
  "build",
  ".output",
  ".git",
  ".vinxi",
  "coverage",
]);

const TAILWIND_MARKERS = [
  '@import "tailwindcss"',
  "@import 'tailwindcss'",
  "@tailwind base",
];

/**
 * Finds the stylesheet that pulls in Tailwind, which is where theme variables
 * belong. Walks a bounded depth rather than globbing so no dependency is
 * needed and a large repository stays cheap to scan.
 */
export function findTailwindCss(cwd: string, maxDepth = 4): string | null {
  const candidates: string[] = [];

  const walk = (dir: string, depth: number): void => {
    if (depth > maxDepth) return;

    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.name.startsWith(".") && entry.name !== ".") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!IGNORED.has(entry.name)) walk(full, depth + 1);
      } else if (entry.name.endsWith(".css")) {
        candidates.push(full);
      }
    }
  };

  walk(path.resolve(cwd), 0);

  // Shallower files win: an app entry stylesheet outranks a nested partial.
  candidates.sort((a, b) =>
    a.split(path.sep).length - b.split(path.sep).length
  );

  for (const candidate of candidates) {
    try {
      const contents = readFileSync(candidate, "utf8");
      if (TAILWIND_MARKERS.some((marker) => contents.includes(marker))) {
        return candidate;
      }
    } catch {
      continue;
    }
  }

  return null;
}

/** Locates a Vite config, whose plugin list `init` needs to report on. */
export function findViteConfig(cwd: string): string | null {
  for (
    const name of [
      "vite.config.ts",
      "vite.config.js",
      "vite.config.mts",
      "vite.config.mjs",
    ]
  ) {
    const candidate = path.join(path.resolve(cwd), name);
    try {
      readFileSync(candidate, "utf8");
      return candidate;
    } catch {
      continue;
    }
  }
  return null;
}
