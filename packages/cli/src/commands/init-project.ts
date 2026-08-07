import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { CONFIG_FILE, resolveConfigPaths } from "../config/get-config.ts";
import type { RawConfig } from "../config/schema.ts";
import {
  DEFAULT_ICON_LIBRARY,
  REGISTRY_INDEX_URL,
  REGISTRY_THEME_URL,
} from "../registry/constants.ts";
import { fetchRegistryIndex, fetchRegistryItem } from "../registry/fetcher.ts";
import { isUrl } from "../registry/address.ts";
import type { ProjectTarget } from "../runtime/target.ts";
import { readNodeModulesDir } from "../runtime/deno.ts";
import {
  BASE_DEPENDENCIES,
  BASE_DEV_DEPENDENCIES,
} from "../updaters/css-conventions.ts";
import { updateDependencies } from "../updaters/update-dependencies.ts";
import { transformCssVars } from "../updaters/update-css-vars.ts";
import { findTailwindCss, findViteConfig } from "../utils/find-css.ts";
import { addComponents } from "./add-components.ts";

export const DEFAULT_BASE_COLOR = "zinc";

export class InitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InitError";
  }
}

export interface InitOptions {
  baseColor?: string;
  iconLibrary?: string;
  cssVariables?: boolean;
  force?: boolean;
  silent?: boolean;
}

export interface InitResult {
  configPath: string;
  config: RawConfig;
  cssPath: string;
  /** Set when the project needs unplugin-icons registered by hand. */
  viteConfigPath: string | null;
  needsIconPlugin: boolean;
  /** Deno only: a real node_modules is required by the Vite plugins. */
  nodeModulesDirWarning: string | null;
}

/**
 * Theme items come in two shapes. A *base colour* carries the full neutral
 * palette — `background`, `foreground`, `border`, `radius` and the rest — and
 * is what a project is founded on. An *accent overlay* (blue, rose, …) carries
 * only `primary`, `secondary` and the chart ramp, and is meant to be layered
 * on top of a base. Choosing an overlay as the base leaves a stylesheet with
 * no background or radius, so the two are kept apart by whether `background`
 * is present.
 */
function isBaseColor(item: { cssVars?: { light?: Record<string, string> } }) {
  return Boolean(item.cssVars?.light?.background);
}

export async function listBaseColors(): Promise<string[]> {
  const index = await fetchRegistryIndex(REGISTRY_INDEX_URL);
  return index.items
    .filter((item) => item.type === "registry:theme" && isBaseColor(item))
    .map((item) => item.name);
}

export async function listAccentThemes(): Promise<string[]> {
  const index = await fetchRegistryIndex(REGISTRY_INDEX_URL);
  return index.items
    .filter((item) => item.type === "registry:theme" && !isBaseColor(item))
    .map((item) => item.name);
}

function themeSource(name: string) {
  const location = REGISTRY_THEME_URL.replace("{name}", name);
  return isUrl(location) ? { url: location } : { path: location };
}

/**
 * Derives components.json from what the project already declares, so `init`
 * adopts the alias the project uses rather than imposing one.
 */
export async function buildConfig(
  cwd: string,
  target: ProjectTarget,
  options: InitOptions,
): Promise<{ config: RawConfig; cssPath: string }> {
  const prefix = await target.aliasPrefix();
  if (!prefix) {
    throw new InitError(
      target.runtime === "deno"
        ? 'No path alias found. Add one to "imports" in deno.json, for example {"~/": "./src/"}.'
        : 'No path alias found. Add one to "paths" in tsconfig.json, for example {"@/*": ["./src/*"]}.',
    );
  }

  const cssPath = findTailwindCss(cwd);
  if (!cssPath) {
    throw new InitError(
      'No stylesheet importing Tailwind was found. Create one containing `@import "tailwindcss";` first.',
    );
  }

  return {
    cssPath,
    config: {
      $schema: "https://shadcn-solid.com/schema.json",
      tsx: true,
      tailwind: {
        css: path.relative(cwd, cssPath).split(path.sep).join("/"),
        baseColor: options.baseColor ?? DEFAULT_BASE_COLOR,
        cssVariables: options.cssVariables ?? true,
      },
      iconLibrary: options.iconLibrary ?? DEFAULT_ICON_LIBRARY,
      aliases: {
        components: `${prefix}/components`,
        utils: `${prefix}/lib/utils`,
        ui: `${prefix}/components/ui`,
        lib: `${prefix}/lib`,
        hooks: `${prefix}/hooks`,
      },
    },
  };
}

/**
 * Writes components.json, seeds the stylesheet from the chosen base colour,
 * and installs the shared `utils` helper every component imports.
 */
export async function initProject(
  cwd: string,
  target: ProjectTarget,
  options: InitOptions = {},
): Promise<InitResult> {
  const configPath = path.join(cwd, CONFIG_FILE);
  if (existsSync(configPath) && !options.force) {
    throw new InitError(
      `${CONFIG_FILE} already exists in ${cwd}. Pass --force to overwrite it.`,
    );
  }

  const { config, cssPath } = await buildConfig(cwd, target, options);

  const baseColors = await listBaseColors();
  if (!baseColors.includes(config.tailwind.baseColor)) {
    const accents = await listAccentThemes();
    const hint = accents.includes(config.tailwind.baseColor)
      ? `"${config.tailwind.baseColor}" is an accent theme, not a base color — apply it with \`shadcn-solidjs add ${config.tailwind.baseColor}\` after init. `
      : "";
    throw new InitError(
      `${hint}Choose a base color from: ${baseColors.join(", ")}.`,
    );
  }

  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");

  const theme = await fetchRegistryItem(themeSource(config.tailwind.baseColor));
  if (theme.cssVars) {
    writeFileSync(
      cssPath,
      transformCssVars(readFileSync(cssPath, "utf8"), theme.cssVars),
      "utf8",
    );
  }

  const resolved = await resolveConfigPaths(cwd, config, target);

  // Through the updater rather than the target directly, so re-running init
  // never rewrites a range the project already pinned.
  await updateDependencies(
    [...BASE_DEPENDENCIES],
    [...BASE_DEV_DEPENDENCIES],
    target,
    { silent: options.silent },
  );

  // Every ui item imports `cn`, but no item declares it as a dependency —
  // upstream leaves it to init as well.
  await addComponents(["utils"], resolved, target, { silent: options.silent });

  const viteConfigPath = findViteConfig(cwd);
  const needsIconPlugin = viteConfigPath
    ? !readFileSync(viteConfigPath, "utf8").includes("unplugin-icons")
    : true;

  const nodeModulesDir = target.runtime === "deno"
    ? readNodeModulesDir(target.configPath)
    : undefined;

  return {
    configPath,
    config,
    cssPath,
    viteConfigPath,
    needsIconPlugin,
    nodeModulesDirWarning: nodeModulesDir === "none"
      ? 'deno.json sets "nodeModulesDir": "none", but unplugin-icons and the Tailwind Vite plugin need a real node_modules. Set it to "auto" or "manual".'
      : null,
  };
}
