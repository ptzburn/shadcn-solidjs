/**
 * Round-trip verifier for the cn-* style-marker refactor.
 *
 * For each registry ui component it checks that inlining the style
 * markers of the current authored source reproduces the pre-refactor
 * source (a git revision, default HEAD) exactly, up to:
 *
 * - token order inside string literals (tailwind-merge reorders), and
 * - whitespace/formatting differences.
 *
 * Any added or dropped class token, or any non-string code change, is
 * reported as a failure with a per-literal diff.
 *
 * Usage:
 *   deno run -A ./src/scripts/verify-style-refactor.ts [name ...]
 *     [--baseline <git-rev>] [--css <extra-style-css> ...]
 *
 * --css appends extra style CSS files (e.g. an in-progress fragment) to
 * src/registry/styles/style-nova.css when building the style map.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

import { createStyleMap, inlineStyles } from "../lib/registry/style-map.ts";

const UI_DIR = path.join(process.cwd(), "src", "registry", "ui");

const args = process.argv.slice(2);
const names: string[] = [];
const extraCss: string[] = [];
let baseline = "HEAD";
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--baseline") {
    baseline = args[++i];
  } else if (args[i] === "--css") {
    extraCss.push(args[++i]);
  } else if (!args[i].startsWith("--")) {
    names.push(args[i]);
  } else {
    throw new Error(`Unknown flag ${args[i]}`);
  }
}

const components = names.length > 0
  ? names.map((name) => `${name.replace(/\.tsx$/, "")}.tsx`)
  : readdirSync(UI_DIR).filter((file) => file.endsWith(".tsx")).sort();

const styleMap = createStyleMap(
  [
    path.join(process.cwd(), "src", "registry", "styles", "style-nova.css"),
    ...extraCss,
  ]
    .map((file) => readFileSync(file, "utf8"))
    .join("\n"),
);

function gitShow(file: string): string {
  const result = new Deno.Command("git", {
    args: ["show", `${baseline}:./src/registry/ui/${file}`],
    cwd: process.cwd(),
    stdout: "piped",
    stderr: "piped",
  }).outputSync();
  if (!result.success) {
    throw new Error(
      `git show failed for ${file}: ${
        new TextDecoder().decode(result.stderr).trim()
      }`,
    );
  }
  return new TextDecoder().decode(result.stdout);
}

const STRING_LITERAL_RE = /"(?:[^"\\\n])*"/g;

function sortLiteralTokens(literal: string): string {
  const tokens = literal.slice(1, -1).split(/\s+/).filter(Boolean).sort();
  return `"${tokens.join(" ")}"`;
}

function normalize(source: string): string {
  return source
    .replace(STRING_LITERAL_RE, sortLiteralTokens)
    .replace(/\s+/g, " ")
    .trim();
}

function literals(normalized: string): string[] {
  return normalized.match(STRING_LITERAL_RE) ?? [];
}

let failures = 0;

for (const file of components) {
  const name = file.replace(/\.tsx$/, "");
  let original: string;
  try {
    original = gitShow(file);
  } catch {
    console.log(`SKIP ${name} (not in ${baseline})`);
    continue;
  }

  const authored = readFileSync(path.join(UI_DIR, file), "utf8");

  let transformed: string;
  try {
    transformed = inlineStyles(authored, styleMap);
  } catch (error) {
    failures++;
    console.log(`FAIL ${name}: ${(error as Error).message}`);
    continue;
  }

  const normalizedOriginal = normalize(original);
  const normalizedTransformed = normalize(transformed);

  if (normalizedOriginal === normalizedTransformed) {
    console.log(`PASS ${name}`);
    continue;
  }

  failures++;
  console.log(`FAIL ${name}`);

  const originalLiterals = literals(normalizedOriginal);
  const transformedLiterals = literals(normalizedTransformed);
  if (originalLiterals.length !== transformedLiterals.length) {
    console.log(
      `  string literal count differs: ` +
        `${baseline} has ${originalLiterals.length}, ` +
        `transformed has ${transformedLiterals.length} ` +
        `(non-string code was probably changed)`,
    );
  } else {
    for (let i = 0; i < originalLiterals.length; i++) {
      if (originalLiterals[i] === transformedLiterals[i]) {
        continue;
      }
      const before = new Set(originalLiterals[i].slice(1, -1).split(" "));
      const after = new Set(transformedLiterals[i].slice(1, -1).split(" "));
      const missing = [...before].filter((token) => !after.has(token));
      const added = [...after].filter((token) => !before.has(token));
      console.log(`  literal #${i}:`);
      if (missing.length) console.log(`    missing: ${missing.join(" ")}`);
      if (added.length) console.log(`    added:   ${added.join(" ")}`);
    }
  }

  const stripLiterals = (text: string) => text.replace(STRING_LITERAL_RE, '""');
  if (
    stripLiterals(normalizedOriginal) !== stripLiterals(normalizedTransformed)
  ) {
    console.log("  non-string code differs from baseline");
  }
}

console.log(
  failures === 0
    ? `\nAll ${components.length} component(s) verified.`
    : `\n${failures} of ${components.length} component(s) FAILED.`,
);
if (failures > 0) {
  process.exit(1);
}
