import { existsSync } from "node:fs";
import path from "node:path";

import { DenoTarget } from "./deno.ts";
import { NodeTarget } from "./node.ts";
import type { ProjectTarget } from "./target.ts";

const DENO_CONFIGS = ["deno.json", "deno.jsonc"];

/**
 * Finds the project being installed into by walking up from `cwd` and taking
 * the first directory that holds a runtime config.
 *
 * A Deno config wins over a sibling package.json: Deno projects may carry a
 * package.json, but a Node project never carries a deno.json. Deciding per
 * directory rather than scanning for each config separately means the
 * *nearest* project wins, so a Node app nested inside a Deno workspace still
 * resolves as Node.
 */
export function detectProjectTarget(cwd: string): ProjectTarget | null {
  const root = path.resolve(cwd);
  let dir = root;

  while (true) {
    for (const name of DENO_CONFIGS) {
      const candidate = path.join(dir, name);
      if (existsSync(candidate)) return new DenoTarget(root, candidate);
    }

    const pkg = path.join(dir, "package.json");
    if (existsSync(pkg)) return new NodeTarget(root, pkg);

    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}
