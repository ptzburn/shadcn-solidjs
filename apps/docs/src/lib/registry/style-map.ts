/**
 * Style-map transform for the registry build.
 *
 * Authored registry components use `cn-*` marker classes (mirroring the
 * upstream shadcn `registry/bases` sources). The visual tokens for each
 * marker live in `src/registry/styles/style-nova.css` as `@apply` rules.
 *
 * At build time the markers are replaced with their inlined Tailwind
 * tokens (then run through tailwind-merge), so consumers receive fully
 * inlined class strings — the same output shape ui.shadcn.com ships.
 * The docs site instead loads the style CSS at runtime via app.css.
 */
import postcss from "postcss";
import { twMerge } from "tailwind-merge";

/**
 * Marker classes that ship as-is: they are selector hooks with no style
 * tokens of their own (styled by consumers or third-party CSS).
 */
export const STYLE_ALLOWLIST: ReadonlySet<string> = new Set([
  "cn-rtl-flip",
]);

export type StyleMap = Record<string, string>;

const CN_PREFIX = "cn-";
const SIMPLE_CN_SELECTOR = /^\.(cn-[a-z0-9-]+)$/;

/**
 * Parses a style CSS file into a map of `cn-*` class name to the
 * whitespace-joined tokens of its `@apply` rules. Selectors must be
 * simple single classes (`.cn-foo`); anything else containing a `cn-`
 * class is an error so the authored CSS stays parseable.
 *
 * An empty rule (`.cn-foo {}`) declares a marker this style leaves
 * unstyled — the marker is known and gets dropped at build time, while
 * undeclared markers still fail the build.
 */
export function createStyleMap(css: string): StyleMap {
  const root = postcss.parse(css);
  const map: StyleMap = {};

  root.walkRules((rule) => {
    const tokens: string[] = [];
    for (const node of rule.nodes ?? []) {
      if (node.type === "atrule" && node.name === "apply") {
        const value = node.params.trim();
        if (value) {
          tokens.push(value);
        }
      }
    }

    for (const selector of rule.selectors ?? []) {
      const match = selector.trim().match(SIMPLE_CN_SELECTOR);
      if (!match) {
        if (selector.includes(CN_PREFIX)) {
          throw new Error(
            `Unsupported selector "${selector}" in style CSS: ` +
              `only simple .cn-* class selectors may carry @apply rules`,
          );
        }
        continue;
      }
      const className = match[1];
      map[className] = className in map
        ? [map[className], ...tokens].filter(Boolean).join(" ")
        : tokens.join(" ");
    }
  });

  return map;
}

const STRING_LITERAL_RE = /"(?:[^"\\\n])*"/g;

/**
 * Replaces `cn-*` marker tokens inside double-quoted string literals with
 * their mapped tokens and normalizes the result with tailwind-merge.
 * Unknown `cn-*` tokens (outside the allowlist) throw, so typos and
 * missing CSS blocks fail the build instead of shipping.
 */
export function inlineStyles(source: string, styleMap: StyleMap): string {
  const transformed = source.replace(STRING_LITERAL_RE, (literal) => {
    const value = literal.slice(1, -1);
    const tokens = value.split(/\s+/).filter(Boolean);
    if (!tokens.some((token) => token.startsWith(CN_PREFIX))) {
      return literal;
    }

    const expanded = tokens.flatMap((token) => {
      if (!token.startsWith(CN_PREFIX)) {
        return [token];
      }
      if (token in styleMap) {
        return styleMap[token].split(/\s+/).filter(Boolean);
      }
      if (STYLE_ALLOWLIST.has(token)) {
        return [token];
      }
      throw new Error(`Unknown style marker "${token}"`);
    });

    return `"${twMerge(expanded.join(" "))}"`;
  })
    // A marker that inlines to nothing leaves an empty first argument
    // behind; upstream's transform drops it (removeEmptyArgumentsFromCnCall)
    // so consumers never see cn("", ...).
    .replace(/\bcn\(\s*"",\s*/g, "cn(");

  // Markers must never hide in template literals where the transform
  // cannot reach them.
  const templates = transformed.match(/`[^`]*`/g) ?? [];
  for (const template of templates) {
    if (/(^|[\s`])cn-[a-z0-9-]+/.test(template)) {
      throw new Error(
        `Style marker found in a template literal: ${template.slice(0, 80)}`,
      );
    }
  }

  return transformed;
}
