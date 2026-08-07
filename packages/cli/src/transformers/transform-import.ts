import type { Config } from "../config/schema.ts";
import type { ProjectTarget } from "../runtime/target.ts";

export interface TransformContext {
  config: Config;
  target: ProjectTarget;
}

/**
 * Matches the specifier of `from "x"`, `import "x"` and `import("x")`, so a
 * string that merely looks like a path elsewhere in the file is left alone.
 */
const SPECIFIER_RE =
  /(\bfrom\s+|\bimport\s*\(\s*|\bimport\s+)(["'])([^"']+)\2/g;

const EXTENSION_RE = /\.tsx?$/;

function basename(specifier: string): string {
  return specifier.slice(specifier.lastIndexOf("/") + 1);
}

/**
 * Rewrites the three shapes this registry emits onto the consumer's aliases,
 * and leaves everything else — bare npm packages, `solid-js`, and the
 * `~icons/<library>/<name>` virtual modules — untouched.
 *
 * The rewritten specifier keeps the source extension so the target can decide:
 * Deno resolves by exact path and needs it, Node and Vite projects omit it.
 * Aliases in components.json are written without an extension either way.
 */
function rewrite(specifier: string, config: Config): string | null {
  const extension = specifier.match(EXTENSION_RE)?.[0] ?? "";
  const stem = specifier.replace(EXTENSION_RE, "");

  if (stem === "~/lib/utils") {
    return config.aliases.utils + extension;
  }

  if (stem.startsWith("~/lib/hooks/")) {
    return `${config.aliases.hooks}/${basename(stem)}${extension}`;
  }

  // Registry sources import their siblings relatively; consumers may place a
  // dependency elsewhere, so these become alias-based.
  if (stem.startsWith("./") && extension) {
    return `${config.aliases.ui}/${basename(stem)}${extension}`;
  }

  return null;
}

export function transformImports(
  content: string,
  { config, target }: TransformContext,
): string {
  return content.replace(
    SPECIFIER_RE,
    (match, prefix: string, quote: string, specifier: string) => {
      const rewritten = rewrite(specifier, config);
      if (!rewritten) return match;
      return `${prefix}${quote}${target.importSpecifier(rewritten)}${quote}`;
    },
  );
}
