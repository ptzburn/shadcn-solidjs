import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, test } from "vite-plus/test";

import { detectProjectTarget } from "./detect.ts";
import { NodeTarget } from "./node.ts";
import { detectPackageManager, installArgs } from "./package-manager.ts";
import { assertSafeSpecs, UnsafeDependencyError } from "./target.ts";

const REPO_ROOT = path.resolve(import.meta.dirname!, "../../../..");

/** Builds a throwaway project tree and removes it when `run` returns. */
function withProject(
  files: Record<string, string>,
  run: (dir: string) => void | Promise<void>,
): Promise<void> {
  const dir = mkdtempSync(path.join(tmpdir(), "shadcn-solidjs-"));
  try {
    for (const [name, contents] of Object.entries(files)) {
      const target = path.join(dir, name);
      mkdirSync(path.dirname(target), { recursive: true });
      writeFileSync(target, contents);
    }
    return Promise.resolve(run(dir)).finally(() => {
      rmSync(dir, { recursive: true, force: true });
    });
  } catch (error) {
    rmSync(dir, { recursive: true, force: true });
    throw error;
  }
}

// ---------------------------------------------------------------- detection

test("detects a Node project", () =>
  withProject({ "package.json": "{}" }, (dir) => {
    expect(detectProjectTarget(dir)?.configPath).toEqual(
      path.join(dir, "package.json"),
    );
  }));

test("finds the project from a nested directory", () =>
  withProject(
    { "package.json": "{}", "src/components/.keep": "" },
    (dir) => {
      const nested = path.join(dir, "src/components");
      const target = detectProjectTarget(nested);
      expect(target?.cwd).toEqual(nested);
      expect(target?.configPath).toEqual(path.join(dir, "package.json"));
    },
  ));

test("a deno.json alone is not a project", () =>
  withProject({ "deno.json": "{}", "src/.keep": "" }, (dir) => {
    expect(detectProjectTarget(path.join(dir, "src"))).toBeNull();
  }));

// ------------------------------------------------------------ Node aliases

test("resolves against this repo's own docs app", async () => {
  const docs = path.join(REPO_ROOT, "apps/docs");
  const target = NodeTarget.detect(docs)!;

  expect(await target.aliasPrefix()).toEqual("~");
  const resolved = await target.resolveImport("~/lib/utils.ts");
  expect(
    resolved?.endsWith(path.join("apps", "docs", "src", "lib", "utils.ts")),
    `unexpected resolution: ${resolved}`,
  ).toBe(true);
});

// ------------------------------------------------------------ Node aliases

const TSCONFIG = JSON.stringify({
  compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } },
});

test("reads the Node alias prefix from tsconfig paths", () =>
  withProject(
    { "package.json": "{}", "tsconfig.json": TSCONFIG },
    async (dir) => {
      expect(await NodeTarget.detect(dir)!.aliasPrefix()).toEqual("@");
    },
  ));

test("resolves a Node aliased import to a path", () =>
  withProject(
    { "package.json": "{}", "tsconfig.json": TSCONFIG },
    async (dir) => {
      const resolved = await NodeTarget.detect(dir)!.resolveImport(
        "@/lib/utils",
      );
      expect(resolved?.endsWith(path.join("src", "lib", "utils")), `unexpected resolution: ${resolved}`).toBe(true);
    },
  ));

test("tolerates a tsconfig with comments", () =>
  withProject(
    {
      "package.json": "{}",
      "tsconfig.json": `{
        // vite default
        "compilerOptions": { "baseUrl": ".", "paths": { "~/*": ["./src/*"] } },
      }`,
    },
    async (dir) => {
      expect(await NodeTarget.detect(dir)!.aliasPrefix()).toEqual("~");
    },
  ));

// ------------------------------------------------------- import specifiers

test("strips the extension from an import specifier", () =>
  withProject({ "package.json": "{}" }, (dir) => {
    const node = NodeTarget.detect(dir)!;

    expect(node.importSpecifier("@/components/ui/button.tsx")).toEqual("@/components/ui/button");
    expect(node.importSpecifier("@/lib/utils.ts")).toEqual("@/lib/utils");
    expect(node.importSpecifier("@kobalte/core")).toEqual("@kobalte/core");
  }));

// ------------------------------------------------------------ dependencies

test("rejects a dependency that would read as a flag", () => {
  expect(() => assertSafeSpecs(["@kobalte/core", "--registry=evil"])).toThrow(UnsafeDependencyError);
});

test("accepts ordinary dependency names", () => {
  assertSafeSpecs(["@kobalte/core", "clsx", "tailwind-merge@^3.6.0"]);
});

test("yarn spells the dev flag differently", () => {
  expect(installArgs("yarn", ["clsx"], true)).toEqual(["add", "--dev", "clsx"]);
  expect(installArgs("pnpm", ["clsx"], true)).toEqual(["add", "-D", "clsx"]);
  expect(installArgs("npm", ["clsx"], false)).toEqual(["add", "clsx"]);
});

// -------------------------------------------------------- package managers

test("detects the package manager from a lockfile", () =>
  withProject(
    { "package.json": "{}", "pnpm-lock.yaml": "" },
    (dir) => expect(detectPackageManager(dir)).toEqual("pnpm"),
  ));

test("the packageManager field wins over a lockfile", () =>
  withProject(
    {
      "package.json": JSON.stringify({ packageManager: "yarn@4.1.0" }),
      "package-lock.json": "{}",
    },
    (dir) => expect(detectPackageManager(dir)).toEqual("yarn"),
  ));

test("inherits a lockfile from the repository root", () =>
  withProject(
    { "bun.lock": "", "apps/web/package.json": "{}" },
    (dir) =>
      expect(detectPackageManager(path.join(dir, "apps/web"))).toEqual("bun"),
  ));
