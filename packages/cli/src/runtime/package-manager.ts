import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun" | "deno";

const LOCKFILES: Array<[string, PackageManager]> = [
  ["deno.lock", "deno"],
  ["bun.lock", "bun"],
  ["bun.lockb", "bun"],
  ["pnpm-lock.yaml", "pnpm"],
  ["yarn.lock", "yarn"],
  ["package-lock.json", "npm"],
];

function fromPackageManagerField(cwd: string): PackageManager | null {
  const pkgPath = path.join(cwd, "package.json");
  if (!existsSync(pkgPath)) return null;
  try {
    const field = JSON.parse(readFileSync(pkgPath, "utf8")).packageManager;
    if (typeof field !== "string") return null;
    const name = field.split("@")[0];
    return isPackageManager(name) ? name : null;
  } catch {
    return null;
  }
}

function fromUserAgent(): PackageManager | null {
  const agent = process.env.npm_config_user_agent;
  if (!agent) return null;
  const name = agent.split("/")[0];
  return isPackageManager(name) ? name : null;
}

function isPackageManager(value: string): value is PackageManager {
  return value === "npm" || value === "pnpm" || value === "yarn" ||
    value === "bun" || value === "deno";
}

/**
 * `deno install` in a package.json project leaves no lockfile of its own
 * name only when locking is off, but it always lays out node_modules with a
 * `.deno` store — npm's arborist cannot read that tree, so it has to be Deno.
 */
function hasDenoNodeModules(dir: string): boolean {
  return existsSync(path.join(dir, "node_modules", ".deno"));
}

/**
 * Prefers the corepack `packageManager` field, then a lockfile, then the agent
 * that invoked this process. Walks up so a workspace member inherits the
 * lockfile at the repository root.
 */
export function detectPackageManager(cwd: string): PackageManager {
  const fromField = fromPackageManagerField(cwd);
  if (fromField) return fromField;

  let dir = path.resolve(cwd);
  while (true) {
    for (const [lockfile, manager] of LOCKFILES) {
      if (existsSync(path.join(dir, lockfile))) return manager;
    }
    if (hasDenoNodeModules(dir)) return "deno";
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return fromUserAgent() ?? "npm";
}

/**
 * `yarn` spells the dev flag `--dev` rather than `-D`.
 *
 * Upstream also appends a `--` end-of-options separator, which this does not:
 * support for it varies across the four managers, and `assertSafeSpecs` plus
 * spawning without a shell already close the injection it guards against.
 */
export function installArgs(
  manager: PackageManager,
  specs: string[],
  dev: boolean,
): string[] {
  const devFlag = manager === "yarn" ? "--dev" : "-D";
  return ["add", ...(dev ? [devFlag] : []), ...specs];
}
