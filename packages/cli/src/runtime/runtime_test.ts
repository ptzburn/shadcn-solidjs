import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { assert, assertEquals, assertThrows } from "@std/assert";

import { DenoTarget, readNodeModulesDir } from "./deno.ts";
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

Deno.test("detects a Deno project", () =>
  withProject({ "deno.json": "{}" }, (dir) => {
    assertEquals(detectProjectTarget(dir)?.runtime, "deno");
  }));

Deno.test("detects a Node project", () =>
  withProject({ "package.json": "{}" }, (dir) => {
    assertEquals(detectProjectTarget(dir)?.runtime, "node");
  }));

Deno.test("prefers Deno when a project carries both configs", () =>
  withProject({ "deno.json": "{}", "package.json": "{}" }, (dir) => {
    assertEquals(detectProjectTarget(dir)?.runtime, "deno");
  }));

Deno.test("a Node app nested in a Deno workspace resolves as Node", () =>
  withProject(
    { "deno.json": "{}", "apps/web/package.json": "{}" },
    (dir) => {
      const target = detectProjectTarget(path.join(dir, "apps/web"));
      assertEquals(target?.runtime, "node");
    },
  ));

Deno.test("finds the project from a nested directory", () =>
  withProject(
    { "deno.json": "{}", "src/components/.keep": "" },
    (dir) => {
      const target = detectProjectTarget(path.join(dir, "src/components"));
      assertEquals(target?.runtime, "deno");
    },
  ));

// ------------------------------------------------------------ Deno aliases

Deno.test("reads the Deno alias prefix", () =>
  withProject(
    { "deno.json": JSON.stringify({ imports: { "~/": "./src/" } }) },
    async (dir) => {
      assertEquals(await DenoTarget.detect(dir)!.aliasPrefix(), "~");
    },
  ));

Deno.test("ignores bare package specifiers when picking the prefix", () =>
  withProject(
    {
      "deno.json": JSON.stringify({
        imports: { "solid-js": "npm:solid-js@^1.9.14", "@/": "./app/" },
      }),
    },
    async (dir) => {
      assertEquals(await DenoTarget.detect(dir)!.aliasPrefix(), "@");
    },
  ));

Deno.test("resolves a Deno aliased import to a path", () =>
  withProject(
    { "deno.json": JSON.stringify({ imports: { "~/": "./src/" } }) },
    async (dir) => {
      const resolved = await DenoTarget.detect(dir)!.resolveImport(
        "~/lib/utils.ts",
      );
      assertEquals(resolved, path.join(dir, "src/lib/utils.ts"));
    },
  ));

Deno.test("a workspace member's aliases win over the root's", () =>
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
      assertEquals(resolved, path.join(member, "src/lib/utils.ts"));
    },
  ));

Deno.test("resolves against this repo's own docs app", async () => {
  const docs = path.join(REPO_ROOT, "apps/docs");
  const target = DenoTarget.detect(docs)!;

  assertEquals(await target.aliasPrefix(), "~");
  assertEquals(
    await target.resolveImport("~/lib/utils.ts"),
    path.join(docs, "src/lib/utils.ts"),
  );
});

Deno.test("reads nodeModulesDir for the init warning", () => {
  const configPath = path.join(REPO_ROOT, "deno.json");
  assertEquals(readNodeModulesDir(configPath), "manual");
});

// ------------------------------------------------------------ Node aliases

const TSCONFIG = JSON.stringify({
  compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } },
});

Deno.test("reads the Node alias prefix from tsconfig paths", () =>
  withProject(
    { "package.json": "{}", "tsconfig.json": TSCONFIG },
    async (dir) => {
      assertEquals(await NodeTarget.detect(dir)!.aliasPrefix(), "@");
    },
  ));

Deno.test("resolves a Node aliased import to a path", () =>
  withProject(
    { "package.json": "{}", "tsconfig.json": TSCONFIG },
    async (dir) => {
      const resolved = await NodeTarget.detect(dir)!.resolveImport(
        "@/lib/utils",
      );
      assert(
        resolved?.endsWith(path.join("src", "lib", "utils")),
        `unexpected resolution: ${resolved}`,
      );
    },
  ));

Deno.test("tolerates a tsconfig with comments", () =>
  withProject(
    {
      "package.json": "{}",
      "tsconfig.json": `{
        // vite default
        "compilerOptions": { "baseUrl": ".", "paths": { "~/*": ["./src/*"] } },
      }`,
    },
    async (dir) => {
      assertEquals(await NodeTarget.detect(dir)!.aliasPrefix(), "~");
    },
  ));

// ------------------------------------------------------- import specifiers

Deno.test("Deno keeps the file extension, Node strips it", () =>
  withProject({ "deno.json": "{}", "package.json": "{}" }, (dir) => {
    const deno = DenoTarget.detect(dir)!;
    const node = NodeTarget.detect(dir)!;

    assertEquals(
      deno.importSpecifier("~/components/ui/button.tsx"),
      "~/components/ui/button.tsx",
    );
    assertEquals(
      node.importSpecifier("@/components/ui/button.tsx"),
      "@/components/ui/button",
    );
    assertEquals(node.importSpecifier("@/lib/utils.ts"), "@/lib/utils");
    assertEquals(node.importSpecifier("@kobalte/core"), "@kobalte/core");
  }));

// ------------------------------------------------------------ dependencies

Deno.test("rejects a dependency that would read as a flag", () => {
  assertThrows(
    () => assertSafeSpecs(["@kobalte/core", "--registry=evil"]),
    UnsafeDependencyError,
  );
});

Deno.test("accepts ordinary dependency names", () => {
  assertSafeSpecs(["@kobalte/core", "clsx", "tailwind-merge@^3.6.0"]);
});

Deno.test("yarn spells the dev flag differently", () => {
  assertEquals(installArgs("yarn", ["clsx"], true), ["add", "--dev", "clsx"]);
  assertEquals(installArgs("pnpm", ["clsx"], true), ["add", "-D", "clsx"]);
  assertEquals(installArgs("npm", ["clsx"], false), ["add", "clsx"]);
  assertEquals(installArgs("deno", ["clsx"], true), ["add", "-D", "clsx"]);
});

// -------------------------------------------------------- package managers

Deno.test("detects the package manager from a lockfile", () =>
  withProject(
    { "package.json": "{}", "pnpm-lock.yaml": "" },
    (dir) => assertEquals(detectPackageManager(dir), "pnpm"),
  ));

Deno.test("the packageManager field wins over a lockfile", () =>
  withProject(
    {
      "package.json": JSON.stringify({ packageManager: "yarn@4.1.0" }),
      "package-lock.json": "{}",
    },
    (dir) => assertEquals(detectPackageManager(dir), "yarn"),
  ));

Deno.test("a deno.lock means deno manages the package.json project", () =>
  withProject(
    { "package.json": "{}", "deno.lock": "{}" },
    (dir) => assertEquals(detectPackageManager(dir), "deno"),
  ));

Deno.test("a Deno-laid-out node_modules means deno even without a lockfile", () =>
  withProject(
    { "package.json": "{}", "node_modules/.deno/.keep": "" },
    (dir) => assertEquals(detectPackageManager(dir), "deno"),
  ));

Deno.test("inherits a lockfile from the repository root", () =>
  withProject(
    { "bun.lock": "", "apps/web/package.json": "{}" },
    (dir) =>
      assertEquals(detectPackageManager(path.join(dir, "apps/web")), "bun"),
  ));

// ------------------------------------------------------------------ prefix

Deno.test("longest prefix wins", () => {
  const entries: Array<[string, string]> = [
    ["~/", "./src/"],
    ["~/lib/", "./packages/lib/"],
  ];
  assertEquals(
    matchLongestPrefix("~/lib/utils.ts", entries)?.value,
    "./packages/lib/",
  );
  assertEquals(matchLongestPrefix("~/app.tsx", entries)?.value, "./src/");
  assertEquals(matchLongestPrefix("solid-js", entries), null);
});
