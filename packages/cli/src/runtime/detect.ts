import { existsSync } from "node:fs";
import path from "node:path";

import { NodeTarget } from "./node.ts";

const DENO_CONFIGS = ["deno.json", "deno.jsonc"];

/**
 * Finds the project being installed into by walking up from `cwd` and taking
 * the first directory that holds a `package.json`, so a workspace member
 * nested in a larger repository resolves to the member, not the root.
 *
 * A directory that holds a Deno config and no `package.json` is a Deno
 * project, which this CLI does not support: the walk stops there rather than
 * climbing to an unrelated `package.json` above it and installing into that.
 */
export function detectProjectTarget(cwd: string): NodeTarget | null {
  const root = path.resolve(cwd);
  let dir = root;

  while (true) {
    const pkg = path.join(dir, "package.json");
    if (existsSync(pkg)) return new NodeTarget(root, pkg);
    if (DENO_CONFIGS.some((name) => existsSync(path.join(dir, name)))) {
      return null;
    }

    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}
