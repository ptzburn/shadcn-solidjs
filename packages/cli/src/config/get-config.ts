import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { detectProjectTarget } from "../runtime/detect.ts";
import type { ProjectTarget } from "../runtime/target.ts";
import { parseJsonc } from "../utils/jsonc.ts";
import { type Config, type RawConfig, rawConfigSchema } from "./schema.ts";

export const CONFIG_FILE = "components.json";

export class MissingConfigError extends Error {
  constructor(readonly cwd: string) {
    super(
      `No ${CONFIG_FILE} found in ${cwd}. Run \`shadcn-solidjs init\` first.`,
    );
    this.name = "MissingConfigError";
  }
}

export class InvalidConfigError extends Error {
  constructor(readonly configPath: string, cause: unknown) {
    super(`${configPath} is not valid.`, { cause });
    this.name = "InvalidConfigError";
  }
}

export class UnresolvedAliasError extends Error {
  constructor(readonly aliases: string[], readonly cwd: string) {
    super(
      `Could not resolve the following aliases in ${cwd}: ${
        aliases.join(", ")
      }. Check the "paths" in your tsconfig.json or "imports" in your deno.json.`,
    );
    this.name = "UnresolvedAliasError";
  }
}

export class UnsupportedConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsupportedConfigError";
  }
}

export function findConfigFile(cwd: string): string | null {
  const candidate = path.join(path.resolve(cwd), CONFIG_FILE);
  return existsSync(candidate) ? candidate : null;
}

export function getRawConfig(cwd: string): RawConfig | null {
  const configPath = findConfigFile(cwd);
  if (!configPath) return null;

  const parsed = rawConfigSchema.safeParse(
    parseJsonc(readFileSync(configPath, "utf8")),
  );
  if (!parsed.success) {
    throw new InvalidConfigError(configPath, parsed.error);
  }
  return parsed.data;
}

/** `@/lib/utils` → `@/lib`, matching upstream's `lib` fallback. */
function parentAlias(alias: string): string {
  const segments = alias.split("/");
  return segments.length > 1 ? segments.slice(0, -1).join("/") : alias;
}

/**
 * Turns the alias strings in components.json into absolute paths, using
 * whichever alias mechanism the target project actually has.
 */
export async function resolveConfigPaths(
  cwd: string,
  raw: RawConfig,
  target: ProjectTarget,
): Promise<Config> {
  const aliases = {
    components: raw.aliases.components,
    utils: raw.aliases.utils,
    ui: raw.aliases.ui ?? `${raw.aliases.components}/ui`,
    lib: raw.aliases.lib ?? parentAlias(raw.aliases.utils),
    hooks: raw.aliases.hooks ?? `${parentAlias(raw.aliases.components)}/hooks`,
  };

  const entries = await Promise.all(
    Object.entries(aliases).map(
      async ([key, alias]) =>
        [key, alias, await target.resolveImport(alias)] as const,
    ),
  );

  const unresolved = entries.filter(([, , resolved]) => !resolved);
  if (unresolved.length > 0) {
    throw new UnresolvedAliasError(
      unresolved.map(([, alias]) => alias),
      cwd,
    );
  }

  const resolved = Object.fromEntries(
    entries.map(([key, , value]) => [key, value!]),
  ) as Record<keyof typeof aliases, string>;

  return {
    ...raw,
    aliases,
    resolvedPaths: {
      cwd: path.resolve(cwd),
      tailwindCss: path.resolve(cwd, raw.tailwind.css),
      ...resolved,
    },
  };
}

/**
 * Loads and resolves components.json. Returns null when the project has not
 * been initialised, so callers can offer to run `init` instead of failing.
 */
export async function getConfig(cwd: string): Promise<Config | null> {
  const raw = getRawConfig(cwd);
  if (!raw) return null;

  if (!raw.tsx) {
    throw new UnsupportedConfigError(
      'Only "tsx": true is supported. Emitting JavaScript would need a TypeScript downlevel pass this CLI does not ship.',
    );
  }

  const target = detectProjectTarget(cwd);
  if (!target) {
    throw new UnsupportedConfigError(
      `Could not find a deno.json or package.json above ${cwd}.`,
    );
  }

  return await resolveConfigPaths(cwd, raw, target);
}
