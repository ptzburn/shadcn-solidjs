import { existsSync } from "node:fs";
import path from "node:path";

import { NodeTarget } from "./node.ts";

/**
 * Finds the project being installed into by walking up from `cwd` and taking
 * the first directory that holds a `package.json`, so a workspace member
 * nested in a larger repository resolves to the member, not the root.
 */
export function detectProjectTarget(cwd: string): NodeTarget | null {
  const root = path.resolve(cwd);
  let dir = root;

  while (true) {
    const pkg = path.join(dir, "package.json");
    if (existsSync(pkg)) return new NodeTarget(root, pkg);

    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}
