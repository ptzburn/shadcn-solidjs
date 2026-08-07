import { assert, assertEquals, assertStringIncludes } from "@std/assert";
import path from "node:path";

import type { Config } from "../config/schema.ts";
import { resolveRegistryTree } from "../registry/resolver.ts";
import { clearRegistryCache } from "../registry/fetcher.ts";
import type { ProjectTarget } from "../runtime/target.ts";
import { transformImports } from "./transform-import.ts";

const R_DIR = path.resolve(
  import.meta.dirname!,
  "../../../../apps/docs/public/r",
);

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
function fakeTarget(runtime: "deno" | "node"): ProjectTarget {
  return {
    runtime,
    cwd: "/project",
    configPath: "/project/config",
    aliasPrefix: () => Promise.resolve(null),
    resolveImport: () => Promise.resolve(null),
    existingDependencies: () => Promise.resolve(new Set<string>()),
    addDependencies: () => Promise.resolve(),
    importSpecifier: (specifier: string) =>
      runtime === "deno" ? specifier : specifier.replace(/\.tsx?$/, ""),
  };
}

const deno = { config: makeConfig("~"), target: fakeTarget("deno") };
const node = { config: makeConfig("@"), target: fakeTarget("node") };

Deno.test("rewrites the utils import onto the configured alias", () => {
  const source = 'import { cn } from "~/lib/utils.ts";';

  assertEquals(
    transformImports(source, deno),
    'import { cn } from "~/lib/utils.ts";',
  );
  assertEquals(
    transformImports(source, node),
    'import { cn } from "@/lib/utils";',
  );
});

Deno.test("rewrites relative sibling imports onto the ui alias", () => {
  const source = 'import { Button } from "./button.tsx";';

  assertEquals(
    transformImports(source, deno),
    'import { Button } from "~/components/ui/button.tsx";',
  );
  assertEquals(
    transformImports(source, node),
    'import { Button } from "@/components/ui/button";',
  );
});

Deno.test("rewrites hook imports onto the hooks alias", () => {
  const source =
    'import { useMediaQuery } from "~/lib/hooks/use-media-query.ts";';

  assertEquals(
    transformImports(source, deno),
    'import { useMediaQuery } from "~/hooks/use-media-query.ts";',
  );
  assertEquals(
    transformImports(source, node),
    'import { useMediaQuery } from "@/hooks/use-media-query";',
  );
});

Deno.test("leaves bare package specifiers alone", () => {
  const source = [
    'import { mergeProps } from "solid-js";',
    'import * as ButtonPrimitive from "@kobalte/core/button";',
    'import { cva } from "class-variance-authority";',
  ].join("\n");

  assertEquals(transformImports(source, node), source);
  assertEquals(transformImports(source, deno), source);
});

Deno.test("leaves unplugin-icons virtual modules alone", () => {
  const source = 'import IconChevronDown from "~icons/lucide/chevron-down";';

  assertEquals(transformImports(source, node), source);
  assertEquals(transformImports(source, deno), source);
});

Deno.test("rewrites type-only and side-effect imports", () => {
  assertEquals(
    transformImports('import type { ButtonProps } from "./button.tsx";', node),
    'import type { ButtonProps } from "@/components/ui/button";',
  );
  assertEquals(
    transformImports('import "./button.tsx";', node),
    'import "@/components/ui/button";',
  );
});

Deno.test("rewrites dynamic imports", () => {
  assertEquals(
    transformImports('const m = await import("./button.tsx");', node),
    'const m = await import("@/components/ui/button");',
  );
});

Deno.test("leaves lookalike strings that are not imports", () => {
  const source = 'const label = "./button.tsx";';
  assertEquals(transformImports(source, node), source);
});

Deno.test("transforms real sidebar source end to end", async () => {
  clearRegistryCache();
  const tree = await resolveRegistryTree(["sidebar"], {
    iconLibrary: "lucide",
    registries: { "@shadcn-solid": `${R_DIR}/icons/{iconLibrary}/{name}.json` },
  });

  const sidebar = tree.files.find((file) => file.path.endsWith("sidebar.tsx"))!;
  const output = transformImports(sidebar.content!, node);

  assertStringIncludes(output, '"@/components/ui/button"');
  assertStringIncludes(output, '"@/lib/utils"');
  assertStringIncludes(output, '"@/hooks/use-media-query"');
  assert(!output.includes('"~/lib/'), "no source alias should survive");
  assert(!output.includes('from "./'), "no relative sibling should survive");
  assertStringIncludes(output, '"solid-js"');
});

Deno.test("Deno output keeps every extension it needs", async () => {
  clearRegistryCache();
  const tree = await resolveRegistryTree(["sidebar"], {
    iconLibrary: "lucide",
    registries: { "@shadcn-solid": `${R_DIR}/icons/{iconLibrary}/{name}.json` },
  });

  const sidebar = tree.files.find((file) => file.path.endsWith("sidebar.tsx"))!;
  const output = transformImports(sidebar.content!, deno);

  assertStringIncludes(output, '"~/components/ui/button.tsx"');
  assertStringIncludes(output, '"~/lib/utils.ts"');
  assertStringIncludes(output, '"~/hooks/use-media-query.ts"');
});
