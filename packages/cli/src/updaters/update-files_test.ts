import { assert, assertEquals, assertThrows } from "@std/assert";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import type { Config } from "../config/schema.ts";
import type { RegistryItemFile } from "../registry/schema.ts";
import type { ProjectTarget } from "../runtime/target.ts";
import {
  resolveFilePath,
  UnsafeTargetError,
  updateFiles,
} from "./update-files.ts";

function makeConfig(cwd: string): Config {
  return {
    tsx: true,
    tailwind: { css: "src/app.css", baseColor: "zinc", cssVariables: true },
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
    },
    resolvedPaths: {
      cwd,
      tailwindCss: path.join(cwd, "src/app.css"),
      components: path.join(cwd, "src/components"),
      utils: path.join(cwd, "src/lib/utils"),
      ui: path.join(cwd, "src/components/ui"),
      lib: path.join(cwd, "src/lib"),
      hooks: path.join(cwd, "src/hooks"),
    },
  };
}

const target: ProjectTarget = {
  runtime: "node",
  cwd: "/project",
  configPath: "/project/package.json",
  aliasPrefix: () => Promise.resolve("@"),
  resolveImport: () => Promise.resolve(null),
  existingDependencies: () => Promise.resolve(new Set<string>()),
  addDependencies: () => Promise.resolve(),
  importSpecifier: (specifier) => specifier.replace(/\.tsx?$/, ""),
};

function file(
  itemPath: string,
  type: RegistryItemFile["type"],
  content = "export const x = 1;\n",
): RegistryItemFile {
  return { path: itemPath, type, content };
}

function withDir(run: (dir: string) => void): void {
  const dir = mkdtempSync(path.join(tmpdir(), "shadcn-solidjs-files-"));
  try {
    run(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

Deno.test("routes each item type to its alias directory", () =>
  withDir((dir) => {
    const config = makeConfig(dir);
    const cases: Array<[RegistryItemFile, string]> = [
      [
        file("src/registry/ui/button.tsx", "registry:ui"),
        "src/components/ui/button.tsx",
      ],
      [file("src/registry/lib/utils.ts", "registry:lib"), "src/lib/utils.ts"],
      [
        file("src/registry/hook/use-media-query.ts", "registry:hook"),
        "src/hooks/use-media-query.ts",
      ],
    ];

    for (const [item, expected] of cases) {
      assertEquals(
        resolveFilePath(item, config, {}, 0),
        path.join(dir, expected),
      );
    }
  }));

Deno.test("preserves nesting below the registry type directory", () =>
  withDir((dir) => {
    const config = makeConfig(dir);
    assertEquals(
      resolveFilePath(
        file("src/registry/block/sidebar-01/index.tsx", "registry:block"),
        config,
        {},
        0,
      ),
      path.join(dir, "src/components/sidebar-01/index.tsx"),
    );
  }));

Deno.test("--path with a directory redirects every file", () =>
  withDir((dir) => {
    const config = makeConfig(dir);
    assertEquals(
      resolveFilePath(
        file("src/registry/ui/button.tsx", "registry:ui"),
        config,
        { path: "src/widgets" },
        0,
      ),
      path.join(dir, "src/widgets/button.tsx"),
    );
  }));

Deno.test("refuses a target that escapes the project", () =>
  withDir((dir) => {
    const config = makeConfig(dir);
    const escaping = {
      ...file("src/registry/ui/button.tsx", "registry:ui"),
      target: "../../etc/passwd",
    };
    assertThrows(
      () => resolveFilePath(escaping, config, {}, 0),
      UnsafeTargetError,
    );
  }));

Deno.test("writes a component and transforms its imports", () =>
  withDir((dir) => {
    const config = makeConfig(dir);
    const result = updateFiles(
      [
        file(
          "src/registry/ui/card.tsx",
          "registry:ui",
          'import { cn } from "~/lib/utils.ts";\n',
        ),
      ],
      config,
      target,
    );

    assertEquals(result.created.length, 1);
    const written = readFileSync(result.created[0], "utf8");
    assertEquals(written, 'import { cn } from "@/lib/utils";\n');
  }));

Deno.test("leaves an identical file untouched", () =>
  withDir((dir) => {
    const config = makeConfig(dir);
    const item = file("src/registry/ui/card.tsx", "registry:ui");

    updateFiles([item], config, target);
    const second = updateFiles([item], config, target);

    assertEquals(second.created, []);
    assertEquals(second.unchanged.length, 1);
  }));

Deno.test("skips a modified file unless --overwrite", () =>
  withDir((dir) => {
    const config = makeConfig(dir);
    const item = file("src/registry/ui/card.tsx", "registry:ui");

    const first = updateFiles([item], config, target);
    writeFileSync(first.created[0], "// edited by the user\n");

    const skipped = updateFiles([item], config, target);
    assertEquals(skipped.skipped.length, 1);
    assertEquals(
      readFileSync(first.created[0], "utf8"),
      "// edited by the user\n",
      "user edits must survive",
    );

    const forced = updateFiles([item], config, target, { overwrite: true });
    assertEquals(forced.overwritten.length, 1);
    assert(readFileSync(first.created[0], "utf8").includes("export const x"));
  }));

Deno.test("--dry-run resolves and transforms but writes nothing", () =>
  withDir((dir) => {
    const config = makeConfig(dir);
    const result = updateFiles(
      [file("src/registry/ui/card.tsx", "registry:ui")],
      config,
      target,
      { dryRun: true },
    );

    assertEquals(result.created.length, 1);
    assert(!existsSync(result.created[0]), "dry run must not touch disk");
  }));

Deno.test("creates missing intermediate directories", () =>
  withDir((dir) => {
    const config = makeConfig(dir);
    mkdirSync(path.join(dir, "src"), { recursive: true });

    const result = updateFiles(
      [file("src/registry/ui/button.tsx", "registry:ui")],
      config,
      target,
    );
    assert(existsSync(result.created[0]));
  }));
