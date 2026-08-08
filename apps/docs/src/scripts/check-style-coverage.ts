/**
 * Marker coverage checker for the registry styles.
 *
 * Every `cn-*` marker an authored registry component uses must be
 * declared by every style CSS file, otherwise `inlineStyles` throws and
 * the registry build fails for that style. This script reports the gap
 * up front, per style, instead of one marker at a time via build errors.
 *
 * It reports two things per style:
 *
 * - `missing` — markers used by components but not declared. Fatal:
 *   these break `deno task build:registry` for that style.
 * - `unused` — markers declared but never used by any component. Not
 *   fatal (upstream styles carry rules for surfaces our Kobalte port
 *   does not have), but useful when porting a new style.
 *
 * Usage:
 *   deno run -A ./src/scripts/check-style-coverage.ts [style ...]
 *
 * With no arguments every `src/registry/styles/style-*.css` is checked.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

import { createStyleMap, STYLE_ALLOWLIST } from "../lib/registry/style-map.ts";

const REGISTRY_DIR = path.join(process.cwd(), "src", "registry");
const STYLES_DIR = path.join(REGISTRY_DIR, "styles");

/** Registry subdirectories whose sources ship through the build. */
const SOURCE_DIRS = ["ui", "block", "example", "lib", "hook"];

const STRING_LITERAL_RE = /"(?:[^"\\\n])*"/g;
const CN_TOKEN_RE = /^cn-[a-z0-9-]+$/;

function walk(dir: string): string[] {
  let files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      files = files.concat(walk(full));
    } else if (/\.tsx?$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

/**
 * Collects the markers used across the registry sources, mirroring what
 * `inlineStyles` looks at: tokens inside double-quoted string literals.
 * Markers in comments or prose are ignored, same as at build time.
 */
function collectUsedMarkers(): Map<string, string[]> {
  const used = new Map<string, string[]>();

  for (const dir of SOURCE_DIRS) {
    const full = path.join(REGISTRY_DIR, dir);
    let entries: string[];
    try {
      entries = walk(full);
    } catch {
      continue;
    }

    for (const file of entries) {
      const source = readFileSync(file, "utf8");
      for (const literal of source.match(STRING_LITERAL_RE) ?? []) {
        for (const token of literal.slice(1, -1).split(/\s+/)) {
          if (!CN_TOKEN_RE.test(token)) {
            continue;
          }
          const where = path.relative(REGISTRY_DIR, file);
          const seen = used.get(token);
          if (seen) {
            if (!seen.includes(where)) {
              seen.push(where);
            }
          } else {
            used.set(token, [where]);
          }
        }
      }
    }
  }

  return used;
}

const requested = process.argv.slice(2).map((name) =>
  name.replace(/^style-/, "").replace(/\.css$/, "")
);

const available = readdirSync(STYLES_DIR)
  .filter((file) => /^style-[a-z0-9-]+\.css$/.test(file))
  .map((file) => file.slice("style-".length, -".css".length))
  .sort();

const styles = requested.length > 0 ? requested : available;
for (const style of styles) {
  if (!available.includes(style)) {
    throw new Error(
      `Unknown style "${style}" (available: ${available.join(", ")})`,
    );
  }
}

const used = collectUsedMarkers();
const usedNames = [...used.keys()].sort();

console.log(
  `${usedNames.length} marker(s) used across ${SOURCE_DIRS.join(", ")}\n`,
);

let failures = 0;

for (const style of styles) {
  const css = readFileSync(path.join(STYLES_DIR, `style-${style}.css`), "utf8");
  const declared = new Set(Object.keys(createStyleMap(css)));

  const missing = usedNames.filter(
    (name) => !declared.has(name) && !STYLE_ALLOWLIST.has(name),
  );
  const unused = [...declared].filter((name) => !used.has(name)).sort();

  if (missing.length === 0) {
    console.log(
      `PASS ${style} — ${declared.size} declared, ${unused.length} unused`,
    );
  } else {
    failures++;
    console.log(`FAIL ${style} — ${missing.length} undeclared marker(s)`);
    for (const name of missing) {
      console.log(`  ${name}  (${used.get(name)!.join(", ")})`);
    }
  }

  if (unused.length > 0 && styles.length === 1) {
    console.log(`  unused: ${unused.join(" ")}`);
  }
}

console.log(
  failures === 0
    ? `\nAll ${styles.length} style(s) cover every used marker.`
    : `\n${failures} of ${styles.length} style(s) have undeclared markers.`,
);
if (failures > 0) {
  process.exit(1);
}
