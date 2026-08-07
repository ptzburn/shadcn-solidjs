import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { parseJsonc } from "../utils/jsonc.ts";
import { exec } from "./exec.ts";
import {
  type AddDependenciesOptions,
  assertSafeSpecs,
  matchLongestPrefix,
  type ProjectTarget,
} from "./target.ts";

const CONFIG_NAMES = ["deno.json", "deno.jsonc"];

interface DenoConfig {
  imports?: Record<string, string>;
  workspace?: string[];
  nodeModulesDir?: "auto" | "manual" | "none";
}

export function findDenoConfig(cwd: string): string | null {
  let dir = path.resolve(cwd);
  while (true) {
    for (const name of CONFIG_NAMES) {
      const candidate = path.join(dir, name);
      if (existsSync(candidate)) return candidate;
    }
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function readDenoConfig(configPath: string): DenoConfig {
  try {
    return parseJsonc(readFileSync(configPath, "utf8")) as DenoConfig;
  } catch {
    return {};
  }
}

/**
 * Reads `nodeModulesDir`, which `init` warns about: unplugin-icons and the
 * Tailwind v4 Vite plugin both need a real `node_modules` on disk.
 */
export function readNodeModulesDir(
  configPath: string,
): DenoConfig["nodeModulesDir"] {
  return readDenoConfig(configPath).nodeModulesDir;
}

/**
 * Walks up collecting `imports`, nearest first, so a workspace member's own
 * aliases win over the root's while still inheriting what it does not define.
 */
function collectImports(configPath: string): Record<string, string> {
  const merged: Record<string, string> = {};
  let dir = path.dirname(path.resolve(configPath));

  while (true) {
    for (const name of CONFIG_NAMES) {
      const candidate = path.join(dir, name);
      if (!existsSync(candidate)) continue;
      const { imports } = readDenoConfig(candidate);
      for (const [key, value] of Object.entries(imports ?? {})) {
        if (!(key in merged)) merged[key] = value;
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return merged;
}

/** Path aliases point into the project; bare package specifiers do not. */
function isPathAlias(key: string, value: string): boolean {
  return key.endsWith("/") &&
    (value.startsWith("./") || value.startsWith("../"));
}

export class DenoTarget implements ProjectTarget {
  readonly runtime = "deno" as const;

  constructor(readonly cwd: string, readonly configPath: string) {}

  static detect(cwd: string): DenoTarget | null {
    const configPath = findDenoConfig(cwd);
    return configPath ? new DenoTarget(path.resolve(cwd), configPath) : null;
  }

  private imports(): Record<string, string> {
    return collectImports(this.configPath);
  }

  aliasPrefix(): Promise<string | null> {
    for (const [key, value] of Object.entries(this.imports())) {
      if (isPathAlias(key, value)) {
        return Promise.resolve(key.replace(/\/$/, ""));
      }
    }
    return Promise.resolve(null);
  }

  resolveImport(specifier: string): Promise<string | null> {
    const entries = Object.entries(this.imports()).filter(([key, value]) =>
      isPathAlias(key, value)
    );

    const match = matchLongestPrefix(specifier, entries);
    if (!match) return Promise.resolve(null);

    return Promise.resolve(
      path.resolve(path.dirname(this.configPath), match.value, match.rest),
    );
  }

  /**
   * `deno add -D` only applies when writing to a package.json, so a Deno
   * project has no dev/prod split: everything lands in the same `imports` map.
   */
  async addDependencies(
    specs: string[],
    options: AddDependenciesOptions = {},
  ): Promise<void> {
    if (specs.length === 0) return;
    assertSafeSpecs(specs);

    await exec(
      "deno",
      ["add", ...specs.map((spec) => `npm:${spec}`)],
      { cwd: this.cwd, silent: options.silent },
    );
  }

  /** Deno resolves by exact path, so the extension is load-bearing. */
  importSpecifier(specifier: string): string {
    return specifier;
  }
}
