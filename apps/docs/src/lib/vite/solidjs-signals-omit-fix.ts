/**
 * Build-time fix for @solidjs/signals 2.0.0-rc.0's `omit()`.
 *
 * The omit proxy forwards the internal $SOURCES symbol probe to the object
 * it wraps, returning its raw, unfiltered source array. `merge()` — what
 * every JSX spread compiles to — flattens sources through that probe, so
 * merging an omit result silently discards the omit and the omitted keys
 * resurface. Under Kobalte every polymorphic primitive omits `as` and
 * re-spreads, so the leaked `as` overrides the inner `as="button"` with the
 * user's component and rendering recurses until the stack overflows —
 * taking down every page.
 *
 * Fixed here as a transform instead of a node_modules patch: the guard is
 * inserted while vite loads the package, so fresh installs (deno ci, deploy
 * containers) need no extra step. Register it both in `plugins` (serve,
 * build, ssr) and `optimizeDeps.rolldownOptions.plugins` (the dev
 * prebundle, which regular transforms never see). Remove once the fix
 * lands upstream in @solidjs/signals.
 */

const GUARDS: [RegExp, string][] = [
  // dist/dev.js
  [
    /return keys\.includes\(property\) \? undefined : props\[property\];/,
    "if (property === $SOURCES) return undefined; return keys.includes(property) ? undefined : props[property];",
  ],
  // dist/prod/store/utils.js
  [
    /return t\.includes\(r\) \? undefined : e\[r\];/,
    "if (r === $SOURCES) return undefined; return t.includes(r) ? undefined : e[r];",
  ],
  // dist/node.cjs
  [
    /return t\.includes\(n\) \? undefined : e\[n\];/,
    "if (n === $SOURCES) return undefined; return t.includes(n) ? undefined : e[n];",
  ],
];

export function solidjsSignalsOmitFix() {
  return {
    name: "solidjs-signals-omit-fix",
    enforce: "pre" as const,
    transform(code: string, id: string) {
      if (!id.includes("@solidjs/signals")) return;
      // Already guarded (e.g. a manually patched checkout) — leave as is.
      if (code.includes("$SOURCES) return undefined")) return;
      let out = code;
      let hit = false;
      for (const [pattern, replacement] of GUARDS) {
        if (pattern.test(out)) {
          out = out.replace(pattern, replacement);
          hit = true;
        }
      }
      return hit ? { code: out, map: null } : undefined;
    },
  };
}
