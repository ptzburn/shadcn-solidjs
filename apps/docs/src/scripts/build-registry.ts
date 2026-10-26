/**
 * Builds all registry outputs:
 *
 * - `src/__registry__/index.tsx` — lazy component index for the docs site.
 * - `public/r/<name>.json` — registry items in the official shadcn v4
 *   registry-item format, icons resolved to the default library.
 * - `public/r/icons/<library>/<name>.json` — per-icon-library variants of
 *   every item.
 * - `public/r/themes/<name>.json` — theme items (cssVars only).
 * - `public/r/init/<base-color>.json` — the item `shadcn init` starts a
 *   project from (see src/lib/registry/init-item.ts).
 * - `public/r/registry.json` + `public/r/index.json` — item index, and a
 *   `registry.json` in every `styles/<style>/icons/<library>/` directory,
 *   which `shadcn search` reads next to the items a namespace points at.
 * - `public/registry/**` — legacy format predating shadcn-solidjs, icons
 *   resolved to the default library.
 *
 * Two deviations from main while this branch tracks Solid 2:
 *
 * - `cn-*` style markers, inlined per style from
 *   `src/registry/styles/style-<style>.css` (see
 *   src/lib/registry/style-map.ts). The docs site instead styles the
 *   markers at runtime with the active style's CSS, scoped under
 *   `.style-<name>` (see src/lib/style-sheets.ts).
 * - Registry definitions are copied from main in full, but items whose
 *   authored files are not ported yet are skipped (and counted below), so
 *   entries activate as their files land.
 *
 * IconPlaceholder markers are still resolved into concrete
 * `~icons/<library>/<name>` imports per icon library
 * (unplugin-icons / @iconify-json on the consumer side).
 *
 * Run with: pnpm build:registry (or, from apps/docs,
 * node --import ./scripts/lib/alias.mjs src/scripts/build-registry.ts)
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path, { basename } from "node:path";
import process from "node:process";

import { initItem, isBaseColor } from "../lib/registry/init-item.ts";
import { resolveIcons } from "../lib/registry/resolve-icons.ts";
import { createStyleMap, inlineStyles } from "../lib/registry/style-map.ts";
import {
  defaultIconLibrary,
  iconLibraries,
  iconLibraryNames,
} from "../registry/icons/icon-libraries.ts";
import { registry } from "../registry/index.ts";
import { type RegistryItem, registrySchema } from "../registry/schema.ts";
import { defaultStyle, type StyleName, styleNames } from "../registry/styles.ts";

const LEGACY_PATH = path.join(process.cwd(), "public/registry");
const R_PATH = path.join(process.cwd(), "public/r");
const HOMEPAGE = "https://shadcn-solidjs.com";

/**
 * Items name their registry dependencies by URL: the shadcn CLI resolves a
 * bare name against ui.shadcn.com and would install its React component.
 * REGISTRY_ORIGIN points those URLs at a local server when testing a build.
 */
const REGISTRY_ORIGIN = process.env.REGISTRY_ORIGIN ?? HOMEPAGE;

/**
 * Dependencies whose npm `latest` is not the line these components are built
 * on (`@kobalte/core`'s is the Solid 1 release). They are pinned to the exact
 * version the docs install, so a consumer gets the one the docs test.
 */
const PINNED_DEPENDENCIES = ["@kobalte/core"];
const docsDependencies: Record<string, string> = JSON.parse(
  readFileSync(path.join(process.cwd(), "package.json"), "utf8"),
).dependencies;

function pinDependencies(dependencies: string[] | undefined) {
  return dependencies?.map((dependency) => {
    if (!PINNED_DEPENDENCIES.includes(dependency)) return dependency;
    const version = docsDependencies[dependency];
    if (!version) throw new Error(`${dependency} is pinned but not a docs dependency`);
    return `${dependency}@${version}`;
  });
}

const result = registrySchema.safeParse(registry);
if (!result.success) {
  console.error(result.error.issues);
  process.exit(1);
}

function sourcePath(filePath: string) {
  return path.join(process.cwd(), "src", "registry", filePath);
}

const styleMaps = new Map(
  styleNames.map((style) => [
    style,
    createStyleMap(readFileSync(sourcePath(path.join("styles", `style-${style}.css`)), "utf8")),
  ]),
);

// Regenerate from scratch: with items skipped until their files land, a
// stale payload left behind (from main's Solid 1 build, or a renamed item)
// would silently keep serving code this branch no longer vouches for.
rmSync(R_PATH, { recursive: true, force: true });
rmSync(LEGACY_PATH, { recursive: true, force: true });

const skipped: string[] = [];
const items = result.data.filter((item) => {
  if (item.files.every((file) => existsSync(sourcePath(file.path)))) {
    return true;
  }
  skipped.push(item.name);
  return false;
});

/** Authored sources, read once and reused across every icon library. */
const sourceCache = new Map<string, string>();

function readSource(filePath: string) {
  const cached = sourceCache.get(filePath);
  if (cached !== undefined) {
    return cached;
  }
  const content = readFileSync(sourcePath(filePath), "utf8").replaceAll("\r\n", "\n");
  sourceCache.set(filePath, content);
  return content;
}

function readItemFiles(item: RegistryItem, style: StyleName) {
  const styleMap = styleMaps.get(style)!;
  return item.files.map((file) => ({
    ...file,
    content: inlineStyles(readSource(file.path), styleMap),
  }));
}

// #######################################
//    BUILD __registry__/index.tsx
// #######################################

// Two modules from the same entries. `index.tsx` carries the lazy component
// imports the docs site renders previews from. `meta.ts` is the same table
// without them, for the build-time code that only needs file paths: the MDX
// component plugin and the markdown export are imported by vite.config.ts,
// which plain Node loads before any alias exists, and the lazy imports there
// would be hundreds of unresolvable `~/` specifiers.
function renderIndex(withComponents: boolean): string {
  let source = withComponents
    ? `
// @ts-nocheck: autogenerated registry index
// This file is autogenerated by scripts/build-registry.ts
// Do not edit this file directly.
import type { RegistryIndex } from "~/registry/schema.ts"

import { lazy } from "solid-js"

export const Index: RegistryIndex = {
`
    : `
// @ts-nocheck: autogenerated registry metadata
// This file is autogenerated by scripts/build-registry.ts
// Do not edit this file directly.
import type { RegistryIndex } from "~/registry/schema.ts"

export const Meta: RegistryIndex = {
`;
  for (const item of items) {
    // Themes carry no files; lib and hook items are plain modules rather
    // than components the docs site can lazily render.
    if (item.type === "theme" || item.type === "lib" || item.type === "hook") {
      continue;
    }
    const componentPath = item.files[0]?.path;
    const component =
      withComponents && componentPath
        ? `\n    component: lazy(() => import("~/registry/${componentPath}")),`
        : "";
    source += `
  "${item.name}": {
    name: "${item.name}",
    description: "${item.description ?? ""}",
    type: "${item.type}",
    registryDependencies: ${JSON.stringify(item.registryDependencies)},${component}
    files: [${item.files.map(
      (file) =>
        `{
      path: "registry/${file.path}",
      type: "${file.type}",
      target: "${file.target ?? ""}"
    }`,
    )}],
  },`;
  }
  source += `
}
`;
  return source;
}

writeFileSync(path.join(process.cwd(), "src", "__registry__", "index.tsx"), renderIndex(true));
writeFileSync(path.join(process.cwd(), "src", "__registry__", "meta.ts"), renderIndex(false));

// #######################################
//    BUILD public/r (shadcn v4 format)
// #######################################

/** The URL of an item built for one style and icon library. */
function itemUrl(name: string, style: StyleName, library: string) {
  return `${REGISTRY_ORIGIN}/r/styles/${style}/icons/${library}/${name}.json`;
}

const builtNames = new Set(
  items.filter((item) => ["ui", "lib", "hook"].includes(item.type)).map((item) => item.name),
);

function toRegistryItem(
  item: RegistryItem,
  files: { path: string; content: string; type: string; target?: string }[],
  devDependencies: string[],
  tree?: { style: StyleName; library: string },
) {
  const dependencies = pinDependencies(item.dependencies);
  // A dependency resolves within the same style and icon library as the item
  // that names it, so one `registries` URL in components.json picks both.
  const registryDependencies = item.registryDependencies?.map((name) => {
    if (!builtNames.has(name)) {
      throw new Error(`${item.name} depends on ${name}, which the registry does not build`);
    }
    return tree ? itemUrl(name, tree.style, tree.library) : name;
  });
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: `registry:${item.type}`,
    ...(item.title ? { title: item.title } : {}),
    ...(item.description ? { description: item.description } : {}),
    ...(dependencies?.length ? { dependencies } : {}),
    ...(devDependencies.length ? { devDependencies } : {}),
    ...(registryDependencies?.length ? { registryDependencies } : {}),
    ...(files.length
      ? {
          files: files.map((file) => ({
            path: `src/registry/${file.path}`,
            content: file.content,
            type: `registry:${file.type}`,
            ...(file.target ? { target: file.target } : {}),
          })),
        }
      : {}),
    ...(item.cssVars ? { cssVars: item.cssVars } : {}),
  };
}

function writeJson(filePath: string, payload: unknown) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  // Trailing newline so the emitted registry is already formatter clean.
  // Without it every build leaves files that fmt wants to touch and the
  // next build reverts, which the pre-commit hook turns into churn.
  writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

const indexItems: Record<string, unknown>[] = [];
const treeIndexItems = new Map<string, Record<string, unknown>[]>();

for (const item of items) {
  if (item.type === "theme") {
    // Themes carry cssVars rather than files, so nothing in them varies
    // by icon library.
    const payload = toRegistryItem(item, [], []);
    writeJson(path.join(R_PATH, "themes", `${item.name}.json`), payload);
    indexItems.push({ ...payload, files: undefined });
    continue;
  }

  // lib and hook items carry no icons, so the fan-out below writes five
  // identical variants. That is deliberate: it keeps every item addressable
  // under the same `icons/<library>/` prefix the CLI selects per icon
  // library, so resolving a ui item's registryDependencies never has to fall
  // back to a different path.
  if (item.type !== "ui" && item.type !== "lib" && item.type !== "hook") {
    continue;
  }

  for (const style of styleNames) {
    const files = readItemFiles(item, style);

    for (const library of iconLibraryNames) {
      let usesIcons = false;
      const resolved = files.map((file) => {
        const { code, icons } = resolveIcons(file.content, library);
        if (icons.length > 0) {
          usesIcons = true;
        }
        return { ...file, content: code };
      });
      const devDependencies = usesIcons ? ["unplugin-icons", iconLibraries[library].package] : [];
      const payload = toRegistryItem(item, resolved, devDependencies, { style, library });

      const tree = path.join(R_PATH, "styles", style, "icons", library);
      writeJson(path.join(tree, `${item.name}.json`), payload);
      treeIndexItems.set(tree, [
        ...(treeIndexItems.get(tree) ?? []),
        { ...payload, files: undefined },
      ]);

      // The default style also lives at the unprefixed paths, so
      // registries pinned before styles existed keep resolving.
      if (style === defaultStyle) {
        writeJson(path.join(R_PATH, "icons", library, `${item.name}.json`), payload);
        if (library === defaultIconLibrary) {
          writeJson(path.join(R_PATH, `${item.name}.json`), payload);
          indexItems.push({ ...payload, files: undefined });
        }
      }
    }
  }
}

for (const theme of items.filter((item) => item.type === "theme" && isBaseColor(item))) {
  writeJson(
    path.join(R_PATH, "init", `${theme.name}.json`),
    initItem(theme, itemUrl("utils", defaultStyle, defaultIconLibrary)),
  );
}

const registryIndex = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "shadcn-solidjs",
  homepage: HOMEPAGE,
  items: indexItems,
};
writeJson(path.join(R_PATH, "registry.json"), registryIndex);
writeJson(path.join(R_PATH, "index.json"), registryIndex);
for (const [tree, treeItems] of treeIndexItems) {
  writeJson(path.join(tree, "registry.json"), { ...registryIndex, items: treeItems });
}

// #######################################
//    BUILD public/registry (legacy pre-shadcn-solidjs format)
// #######################################

for (const item of items) {
  if (item.type !== "ui") {
    continue;
  }

  // The legacy format predates styles, so it ships the default one.
  let usesIcons = false;
  const files = readItemFiles(item, defaultStyle).map((file) => {
    const { code, icons } = resolveIcons(file.content, defaultIconLibrary);
    if (icons.length > 0) {
      usesIcons = true;
    }
    return { name: basename(file.path), content: code };
  });

  const dependencies = pinDependencies(item.dependencies);
  const payload = {
    ...item,
    dependencies: usesIcons
      ? [...(dependencies ?? []), "unplugin-icons", iconLibraries[defaultIconLibrary].package]
      : dependencies,
    files,
  };

  writeJson(path.join(LEGACY_PATH, item.type, `${item.name}.json`), payload);
}

const legacyIndex = items
  .filter((item) => item.type === "ui")
  .map((item) => ({
    ...item,
    files: item.files.map((file) => file.path),
  }));
writeJson(path.join(LEGACY_PATH, "index.json"), legacyIndex);

console.log(
  `Built ${items.filter((i) => i.type === "ui").length} ui items, ` +
    `${items.filter((i) => i.type === "example").length} examples, ` +
    `${items.filter((i) => i.type === "lib").length} lib items, ` +
    `${items.filter((i) => i.type === "hook").length} hooks ` +
    `(x${iconLibraryNames.length} icon libraries), ` +
    `${items.filter((i) => i.type === "theme").length} themes.`,
);
if (skipped.length > 0) {
  console.log(
    `Skipped ${skipped.length} items whose files are not ported yet: ` + skipped.join(", "),
  );
}
