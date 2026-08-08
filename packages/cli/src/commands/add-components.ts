import { readFileSync, writeFileSync } from "node:fs";

import type { Config } from "../config/schema.ts";
import { REGISTRY_INDEX_URL } from "../registry/constants.ts";
import { fetchRegistryIndex } from "../registry/fetcher.ts";
import { resolveRegistryTree } from "../registry/resolver.ts";
import type { ProjectTarget } from "../runtime/target.ts";
import {
  updateDependencies,
  type UpdateDependenciesResult,
} from "../updaters/update-dependencies.ts";
import { transformCssVars } from "../updaters/update-css-vars.ts";
import {
  updateFiles,
  type UpdateFilesResult,
} from "../updaters/update-files.ts";

export interface AddOptions {
  overwrite?: boolean;
  path?: string;
  silent?: boolean;
  dryRun?: boolean;
}

export interface AddResult {
  dependencies: UpdateDependenciesResult;
  files: UpdateFilesResult;
  /** The stylesheet, when an item carried variables that were written to it. */
  cssUpdated: string | null;
}

/** Every installable ui item, for `--all`. */
export async function listComponentNames(): Promise<string[]> {
  const index = await fetchRegistryIndex(REGISTRY_INDEX_URL);
  return index.items
    .filter((item) => item.type === "registry:ui")
    .map((item) => item.name);
}

/**
 * Resolves the requested items and applies them.
 *
 * The order is upstream's and deliberate: dependencies and files land before
 * any stylesheet is touched, so a running dev server rebuilds once everything
 * it needs is already on disk.
 */
export async function addComponents(
  components: string[],
  config: Config,
  target: ProjectTarget,
  options: AddOptions = {},
): Promise<AddResult> {
  const tree = await resolveRegistryTree(components, {
    registries: config.registries,
    iconLibrary: config.iconLibrary,
    style: config.style,
  });

  const dependencies = await updateDependencies(
    tree.dependencies,
    tree.devDependencies,
    target,
    { silent: options.silent, dryRun: options.dryRun },
  );

  const files = updateFiles(tree.files, config, target, {
    overwrite: options.overwrite,
    path: options.path,
    dryRun: options.dryRun,
  });

  // Last, and deliberately: a dev server watching the stylesheet should
  // rebuild once the components and dependencies it needs are already there.
  let cssUpdated: string | null = null;
  if (tree.cssVars && config.tailwind.cssVariables) {
    const cssPath = config.resolvedPaths.tailwindCss;
    if (!options.dryRun) {
      writeFileSync(
        cssPath,
        transformCssVars(readFileSync(cssPath, "utf8"), tree.cssVars, {
          overwrite: true,
        }),
        "utf8",
      );
    }
    cssUpdated = cssPath;
  }

  return { dependencies, files, cssUpdated };
}
