/**
 * Diffs two style CSS files by their resolved marker maps.
 *
 * Compares what the build actually consumes (marker -> inlined tokens)
 * rather than the CSS text, so formatting and rule order are ignored.
 *
 * Its main use is regression-testing `port-style.ts`: our
 * `style-nova.css` is hand-adapted, so replaying the port onto nova and
 * diffing against the real file proves the derivation reproduces work
 * that was done by hand.
 *
 *   deno run -A ./src/scripts/port-style.ts nova --out /tmp/port
 *   deno run -A ./src/scripts/diff-style-map.ts \
 *     /tmp/port/style-nova.css ./src/registry/styles/style-nova.css
 *
 * The expected result is a single difference: nova's
 * `cn-date-picker-content` was hand-tuned to `p-3`, where the derivation
 * follows the style's own popover padding.
 *
 * Usage:
 *   deno run -A ./src/scripts/diff-style-map.ts <generated> <reference>
 */
import { readFileSync } from "node:fs";
import process from "node:process";

import { createStyleMap } from "../lib/registry/style-map.ts";

const [genPath, refPath] = process.argv.slice(2);
if (!genPath || !refPath) {
  throw new Error("Usage: diff-style-map.ts <generated> <reference>");
}

const gen = createStyleMap(readFileSync(genPath, "utf8"));
const ref = createStyleMap(readFileSync(refPath, "utf8"));

const genKeys = new Set(Object.keys(gen));
const refKeys = new Set(Object.keys(ref));

const onlyGen = [...genKeys].filter((key) => !refKeys.has(key)).sort();
const onlyRef = [...refKeys].filter((key) => !genKeys.has(key)).sort();

console.log(`generated: ${genKeys.size}, reference: ${refKeys.size}`);
if (onlyGen.length) console.log(`only in generated: ${onlyGen.join(" ")}`);
if (onlyRef.length) console.log(`only in reference: ${onlyRef.join(" ")}`);

let identical = 0;
const diffs: string[] = [];

for (const key of [...genKeys].filter((key) => refKeys.has(key)).sort()) {
  const a = new Set(gen[key].split(/\s+/).filter(Boolean));
  const b = new Set(ref[key].split(/\s+/).filter(Boolean));
  const missing = [...b].filter((token) => !a.has(token));
  const added = [...a].filter((token) => !b.has(token));
  if (missing.length === 0 && added.length === 0) {
    identical++;
    continue;
  }
  diffs.push(
    `  ${key}\n` +
      (missing.length ? `    missing: ${missing.join(" ")}\n` : "") +
      (added.length ? `    added:   ${added.join(" ")}\n` : ""),
  );
}

console.log(`\nidentical: ${identical}, differing: ${diffs.length}`);
for (const diff of diffs) console.log(diff);
