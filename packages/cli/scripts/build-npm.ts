/**
 * Builds the npm package from this Deno source with dnt.
 *
 * `deno pack` cannot do this job — it emits no `bin` field, which is the whole
 * point of an installer people run as `npx shadcn-solidjs@latest`. dnt does,
 * via an entry point of `kind: "bin"`.
 *
 * The source is written against `node:` builtins rather than `Deno.*`, so no
 * shims are needed and the emitted JavaScript stays close to what was authored.
 *
 * Run with `deno task build:npm`, then publish from `npm/`.
 */
import { build, emptyDir } from "@deno/dnt";
import path from "node:path";
import process from "node:process";

import { VERSION } from "../src/version.ts";

const packageRoot = path.resolve(import.meta.dirname!, "..");
const repoRoot = path.resolve(packageRoot, "../..");
const outDir = path.join(packageRoot, "npm");

await emptyDir(outDir);

await build({
  entryPoints: [{
    kind: "bin",
    name: "shadcn-solidjs",
    path: "./src/index.ts",
  }],
  outDir,
  // No Deno globals in src/, so nothing to shim. Tests are excluded because
  // they do use them — Deno.test and @std/assert — and shipping them would
  // drag both into the npm package for no benefit.
  shims: {},
  test: false,
  // Emit ESM only. The bin is invoked as a program, never imported, so the
  // CommonJS half would be dead weight.
  scriptModule: false,
  // dnt's default target is older than the syntax this code uses: `new
  // Error(msg, { cause })` needs ES2022's ErrorOptions, and `array.at(-1)`
  // needs ES2022 lib. Deno type-checks the same source against esnext.
  compilerOptions: { target: "ES2022" },
  // VERSION is the single source of truth; version_test.ts asserts it matches
  // `version` in deno.json, so the npm and JSR versions cannot drift.
  package: {
    name: "shadcn-solidjs",
    version: VERSION,
    description: "Add SolidJS components to your project.",
    license: "MIT",
    author: "ptzburn",
    homepage: "https://shadcn-solidjs.com",
    repository: {
      type: "git",
      url: "git+https://github.com/ptzburn/shadcn-solidjs.git",
      directory: "packages/cli",
    },
    bugs: {
      url: "https://github.com/ptzburn/shadcn-solidjs/issues",
    },
    keywords: ["solid", "solidjs", "shadcn", "ui", "components", "tailwindcss"],
    engines: { node: ">=20" },
  },
  async postBuild() {
    await Deno.copyFile(
      path.join(repoRoot, "LICENSE"),
      path.join(outDir, "LICENSE"),
    );
    await Deno.copyFile(
      path.join(repoRoot, "README.md"),
      path.join(outDir, "README.md"),
    );
  },
});

process.stdout.write(`\nBuilt shadcn-solidjs@${VERSION} into ${outDir}\n`);
