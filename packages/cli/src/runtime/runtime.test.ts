import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, test } from "vite-plus/test";

import { DenoTarget } from "./deno.ts";
import { detectProjectTarget } from "./detect.ts";
import { NodeTarget } from "./node.ts";
import { detectPackageManager, installArgs } from "./package-manager.ts";
import {
  assertSafeSpecs,
  matchLongestPrefix,
  UnsafeDependencyError,
} from "./target.ts";

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

test("detects a Deno project", () =>
  withProject({ "deno.json": "{}" }, (dir) => {
    expect(detectProjectTarget(dir)?.runtime).toEqual("deno");
  }));

test("detects a Node project", () =>
  withProject({ "package.json": "{}" }, (dir) => {
    expect(detectProjectTarget(dir)?.runtime).toEqual("node");
  }));

test("prefers Deno when a project carries both configs", () =>
  withProject({ "deno.json": "{}", "package.json": "{}" }, (dir) => {
    expect(detectProjectTarget(dir)?.runtime).toEqual("deno");
  }));

test("a Node app nested in a Deno workspace resolves as Node", () =>
  withProject(
    { "deno.json": "{}", "apps/web/package.json": "{}" },
    (dir) => {
      const target = detectProjectTarget(path.join(dir, "apps/web"));
      expect(target?.runtime).toEqual("node");
    },
  ));

test("finds the project from a nested directory", () =>
  withProject(
    { "deno.json": "{}", "src/components/.keep": "" },
    (dir) => {
      const target = detectProjectTarget(path.join(dir, "src/components"));
      expect(target?.runtime).toEqual("deno");
    },
  ));

// ------------------------------------------------------------ Deno aliases

test("reads the Deno alias prefix", () =>
  withProject(
    { "deno.json": JSON.stringify({ imports: { "~/": "./src/" } }) },
    async (dir) => {
      expect(await DenoTarget.detect(dir)!.aliasPrefix()).toEqual("~");
    },
  ));

test("ignores bare package specifiers when picking the prefix", () =>
  withProject(
    {
      "deno.json": JSON.stringify({
        imports: { "solid-js": "npm:solid-js@^1.9.14", "@/": "./app/" },
      }),
    },
    async (dir) => {
      expect(await DenoTarget.detect(dir)!.aliasPrefix()).toEqual("@");
    },
  ));

test("resolves a Deno aliased import to a path", () =>
  withProject(
    { "deno.json": JSON.stringify({ imports: { "~/": "./src/" } }) },
    async (dir) => {
      const resolved = await DenoTarget.detect(dir)!.resolveImport(
        "~/lib/utils.ts",
      );
      expect(resolved).toEqual(path.join(dir, "src/lib/utils.ts"));
    },
  ));

test("a workspace member's aliases win over the root's", () =>
  withProject(
    {
      "deno.json": JSON.stringify({
        workspace: ["./apps/*"],
        imports: { "~/": "./root-src/" },
      }),
      "apps/docs/deno.json": JSON.stringify({ imports: { "~/": "./src/" } }),
    },
    async (dir) => {
      const member = path.join(dir, "apps/docs");
      const resolved = await DenoTarget.detect(member)!.resolveImport(
        "~/lib/utils.ts",
      );
      expect(resolved).toEqual(path.join(member, "src/lib/utils.ts"));
    },
  ));

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

test("Deno keeps the file extension, Node strips it", () =>
  withProject({ "deno.json": "{}", "package.json": "{}" }, (dir) => {
    const deno = DenoTarget.detect(dir)!;
    const node = NodeTarget.detect(dir)!;

    expect(deno.importSpecifier("~/components/ui/button.tsx")).toEqual("~/components/ui/button.tsx");
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
  expect(installArgs("deno", ["clsx"], true)).toEqual(["add", "-D", "clsx"]);
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

test("a deno.lock means deno manages the package.json project", () =>
  withProject(
    { "package.json": "{}", "deno.lock": "{}" },
    (dir) => expect(detectPackageManager(dir)).toEqual("deno"),
  ));

test("a Deno-laid-out node_modules means deno even without a lockfile", () =>
  withProject(
    { "package.json": "{}", "node_modules/.deno/.keep": "" },
    (dir) => expect(detectPackageManager(dir)).toEqual("deno"),
  ));

test("inherits a lockfile from the repository root", () =>
  withProject(
    { "bun.lock": "", "apps/web/package.json": "{}" },
    (dir) =>
      expect(detectPackageManager(path.join(dir, "apps/web"))).toEqual("bun"),
  ));

// ------------------------------------------------------------------ prefix

test("longest prefix wins", () => {
  const entries: Array<[string, string]> = [
    ["~/", "./src/"],
    ["~/lib/", "./packages/lib/"],
  ];
  expect(matchLongestPrefix("~/lib/utils.ts", entries)?.value).toEqual("./packages/lib/");
  expect(matchLongestPrefix("~/app.tsx", entries)?.value).toEqual("./src/");
  expect(matchLongestPrefix("solid-js", entries)).toEqual(null);
});
