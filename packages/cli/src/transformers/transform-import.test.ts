import path from "node:path";
import { expect, test } from "vite-plus/test";

import type { Config } from "../config/schema.ts";
import { clearRegistryCache } from "../registry/fetcher.ts";
import { resolveRegistryTree } from "../registry/resolver.ts";
import type { ProjectTarget } from "../runtime/target.ts";
import { transformImports } from "./transform-import.ts";

const R_DIR = path.resolve(import.meta.dirname!, "../../../../apps/docs/public/r");

function makeConfig(prefix: string): Config {
  return {
    tsx: true,
    tailwind: { css: "src/app.css", baseColor: "zinc", cssVariables: true },
    aliases: {
      components: `${prefix}/components`,
      utils: `${prefix}/lib/utils`,
      ui: `${prefix}/components/ui`,
      lib: `${prefix}/lib`,
      hooks: `${prefix}/hooks`,
    },
    resolvedPaths: {
      cwd: "/project",
      tailwindCss: "/project/src/app.css",
      components: "/project/src/components",
      utils: "/project/src/lib/utils",
      ui: "/project/src/components/ui",
      lib: "/project/src/lib",
      hooks: "/project/src/hooks",
    },
  };
}

/** Only `importSpecifier` matters here; the rest is never reached. */
function fakeTarget(): ProjectTarget {
  return {
    cwd: "/project",
    configPath: "/project/package.json",
    aliasPrefix: () => Promise.resolve(null),
    resolveImport: () => Promise.resolve(null),
    existingDependencies: () => Promise.resolve(new Set<string>()),
    addDependencies: () => Promise.resolve(),
    importSpecifier: (specifier: string) => specifier.replace(/\.tsx?$/, ""),
  };
}

const node = { config: makeConfig("@"), target: fakeTarget() };

test("rewrites the utils import onto the configured alias", () => {
  const source = 'import { cn } from "~/lib/utils.ts";';

  expect(transformImports(source, node)).toEqual('import { cn } from "@/lib/utils";');
});

test("rewrites relative sibling imports onto the ui alias", () => {
  const source = 'import { Button } from "./button.tsx";';

  expect(transformImports(source, node)).toEqual(
    'import { Button } from "@/components/ui/button";',
  );
});

test("rewrites hook imports onto the hooks alias", () => {
  const source = 'import { useMediaQuery } from "~/lib/hooks/use-media-query.ts";';

  expect(transformImports(source, node)).toEqual(
    'import { useMediaQuery } from "@/hooks/use-media-query";',
  );
});

test("leaves bare package specifiers alone", () => {
  const source = [
    'import { mergeProps } from "solid-js";',
    'import * as ButtonPrimitive from "@kobalte/core/button";',
    'import { cva } from "class-variance-authority";',
  ].join("\n");

  expect(transformImports(source, node)).toEqual(source);
});

test("leaves unplugin-icons virtual modules alone", () => {
  const source = 'import IconChevronDown from "~icons/lucide/chevron-down";';

  expect(transformImports(source, node)).toEqual(source);
});

test("rewrites type-only and side-effect imports", () => {
  expect(transformImports('import type { ButtonProps } from "./button.tsx";', node)).toEqual(
    'import type { ButtonProps } from "@/components/ui/button";',
  );
  expect(transformImports('import "./button.tsx";', node)).toEqual(
    'import "@/components/ui/button";',
  );
});

test("rewrites dynamic imports", () => {
  expect(transformImports('const m = await import("./button.tsx");', node)).toEqual(
    'const m = await import("@/components/ui/button");',
  );
});

test("leaves lookalike strings that are not imports", () => {
  const source = 'const label = "./button.tsx";';
  expect(transformImports(source, node)).toEqual(source);
});

test("transforms real sidebar source end to end", async () => {
  clearRegistryCache();
  const tree = await resolveRegistryTree(["sidebar"], {
    iconLibrary: "lucide",
    registries: {
      "@shadcn-solidjs": `${R_DIR}/icons/{iconLibrary}/{name}.json`,
    },
  });

  const sidebar = tree.files.find((file) => file.path.endsWith("sidebar.tsx"))!;
  const output = transformImports(sidebar.content!, node);

  expect(output).toContain('"@/components/ui/button"');
  expect(output).toContain('"@/lib/utils"');
  expect(output).toContain('"@/hooks/use-media-query"');
  expect(!output.includes('"~/lib/'), "no source alias should survive").toBe(true);
  expect(!output.includes('from "./'), "no relative sibling should survive").toBe(true);
  expect(output).toContain('"solid-js"');
});
