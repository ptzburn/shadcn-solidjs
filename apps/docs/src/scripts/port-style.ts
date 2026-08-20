/**
 * Ports an upstream shadcn style CSS file to this registry.
 *
 * Upstream authors one `registry/styles/style-<name>.css` per style, for
 * three primitive bases (Radix, Base UI, React Aria). We have one base
 * (Kobalte), so a straight copy would ship selectors that never match --
 * `data-open` instead of `data-expanded`, `focus:` instead of
 * `data-highlighted:`, and so on.
 *
 * Those adaptations are derivable rather than guesswork: our
 * `style-nova.css` is already a hand-adapted port of upstream's, so
 * diffing the two yields, per marker, exactly which tokens were swapped.
 * This script learns that map from the nova pair and replays it onto
 * another style, so every ported style gets the same treatment nova got.
 *
 * Substitutions are learned and applied *per marker*, never globally:
 * `focus:bg-accent` -> `data-highlighted:bg-accent` is right for a menu
 * item and wrong for a button, so it is only ever applied to the marker
 * it was learned from.
 *
 * Markers our components never use are dropped (upstream's `-aria` and
 * `-logical` variants, Base-UI-only surfaces). Markers we use that
 * upstream does not declare are appended as empty rules, except the
 * handful covering surfaces upstream has no counterpart for, which are
 * composed from that style's own analogues -- see KOBALTE_ONLY below.
 *
 * Usage:
 *   deno run -A ./src/scripts/port-style.ts <style> [...]
 *     [--upstream <dir>] [--out <dir>]
 *
 * `--out` writes elsewhere than the registry, which is how the
 * derivation is regression-tested: replaying it onto nova should
 * reproduce our hand-adapted style-nova.css.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

import postcss from "postcss";

import { createStyleMap, STYLE_ALLOWLIST } from "../lib/registry/style-map.ts";

const REGISTRY_DIR = path.join(process.cwd(), "src", "registry");
const STYLES_DIR = path.join(REGISTRY_DIR, "styles");
const DEFAULT_UPSTREAM = path.resolve(
  process.cwd(),
  "../../../ui/apps/v4/registry/styles",
);

/**
 * Markers with no upstream counterpart in any style, because they cover
 * surfaces our primitives have and upstream's do not: a Kobalte listbox,
 * a Kobalte tabs indicator.
 *
 * None of them is a free invention -- each is composed from the closest
 * upstream marker in the *same* style, so a ported style expresses them
 * in its own visual language (sera's underline inputs, maia's rounded-4xl,
 * lyra's square corners) instead of inheriting nova's.
 *
 * Verified against our hand-authored nova: replaying these derivations
 * onto nova reproduces its values exactly.
 */
type Derivation = (tokensOf: (marker: string) => string[]) => string[];

/** First token matching `re`, or nothing. */
function pick(tokens: string[], re: RegExp): string[] {
  const found = tokens.find((token) => re.test(token));
  return found ? [found] : [];
}

const KOBALTE_ONLY: Record<string, Derivation> = {
  // Our pagination root spaces the list; upstream spaces the list
  // element directly via cn-pagination-content.
  "cn-pagination": (t) =>
    pick(t("cn-pagination-content"), /^gap-/).map((gap) => `[&>ul]:${gap}`),

  // Kobalte's listbox scrolls inside the popper, so it carries the
  // available-height cap and the inset upstream puts on the select group.
  "cn-select-list": (t) => [
    "max-h-(--kb-popper-content-available-height)",
    ...pick(t("cn-select-group"), /^scroll-my-/).map((token) =>
      token.replace("scroll-my-", "scroll-py-")
    ),
    "overflow-y-auto",
    "overscroll-contain",
    ...pick(t("cn-select-group"), /^p-/),
  ],

  // Kobalte renders a moving indicator element where upstream styles the
  // active trigger directly. `bg-foreground` needs no per-style variant:
  // each style's theme redefines the token.
  "cn-tabs-indicator": () => ["bg-foreground"],
};

/**
 * Variant renames that hold everywhere, applied to every marker.
 *
 * The learned map below is keyed per marker, so it only adapts markers
 * our nova happens to adapt. When another style reaches for a state nova
 * leaves unstyled -- luma's `data-open:bg-muted/50` on an accordion item,
 * vega's `data-horizontal:h-1.5` on a slider track -- there is nothing to
 * learn from and the upstream variant passes straight through, dead.
 *
 * These entries are the renames the nova diff shows are unconditional
 * (every occurrence changed, none kept as-is), so applying them globally
 * is safe. Anything context-dependent (`aria-invalid`, `focus`,
 * `data-closed`, `data-[side=*]`) stays with the per-marker map, because
 * Kobalte genuinely uses both spellings depending on the element.
 */
const VARIANT_RENAMES: Record<string, string> = {
  "data-open": "data-expanded",
  "data-selected": "data-[selected=true]",
  "data-horizontal": "data-[orientation=horizontal]",
  "data-vertical": "data-[orientation=vertical]",
  "data-[vaul-drawer-direction=bottom]": "data-[side=bottom]",
  "data-[vaul-drawer-direction=left]": "data-[side=left]",
  "data-[vaul-drawer-direction=right]": "data-[side=right]",
  "data-[vaul-drawer-direction=top]": "data-[side=top]",
  "data-[state=on]": "data-[pressed]",
  // Kobalte marks only the checked state, so "unchecked" is its absence.
  "data-unchecked": "not-data-checked",
};

/** Rewrites known-unconditional variant prefixes in a single token. */
function renameVariants(token: string): string {
  const segments = token.split(":");
  const tail = segments.pop()!;
  const variants = segments.map((variant) => {
    const direct = VARIANT_RENAMES[variant];
    if (direct) return direct;
    // Group/peer forms carry the variant inside: group-data-open/name.
    const scoped = variant.match(/^(group-|peer-)(.+?)(\/.+)?$/);
    if (scoped) {
      const inner = VARIANT_RENAMES[scoped[2]];
      if (inner) return `${scoped[1]}${inner}${scoped[3] ?? ""}`;
    }
    return variant;
  });
  return [...variants, tail].join(":");
}

const args = process.argv.slice(2);
const targets: string[] = [];
let upstreamDir = DEFAULT_UPSTREAM;
let outDir = STYLES_DIR;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--upstream") {
    upstreamDir = path.resolve(args[++i]);
  } else if (args[i] === "--out") {
    outDir = path.resolve(args[++i]);
  } else if (args[i].startsWith("--")) {
    throw new Error(`Unknown flag ${args[i]}`);
  } else {
    targets.push(args[i].replace(/^style-/, "").replace(/\.css$/, ""));
  }
}
if (targets.length === 0) {
  throw new Error("Usage: port-style.ts <style> [...] [--upstream <dir>]");
}

// #######################################
//    Markers our components actually use
// #######################################

const STRING_LITERAL_RE = /"(?:[^"\\\n])*"/g;
const CN_TOKEN_RE = /^cn-[a-z0-9-]+$/;
const SOURCE_DIRS = ["ui", "block", "example", "lib", "hook"];

function walk(dir: string): string[] {
  let files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(walk(full));
    else if (/\.tsx?$/.test(entry.name)) files.push(full);
  }
  return files;
}

const used = new Set<string>();
for (const dir of SOURCE_DIRS) {
  let files: string[];
  try {
    files = walk(path.join(REGISTRY_DIR, dir));
  } catch {
    continue;
  }
  for (const file of files) {
    for (
      const literal of readFileSync(file, "utf8").match(STRING_LITERAL_RE) ?? []
    ) {
      for (const token of literal.slice(1, -1).split(/\s+/)) {
        if (CN_TOKEN_RE.test(token)) used.add(token);
      }
    }
  }
}

// #######################################
//    Learn the adaptation from nova
// #######################################

const upstreamNova = createStyleMap(
  readFileSync(path.join(upstreamDir, "style-nova.css"), "utf8"),
);
const ourNova = createStyleMap(
  readFileSync(path.join(STYLES_DIR, "style-nova.css"), "utf8"),
);

/** The utility part of a token, ignoring its variant prefixes. */
function tail(token: string): string {
  const parts = token.split(":");
  return parts[parts.length - 1];
}

type Adaptation = {
  /** Whole-token rewrites, keyed by the upstream token. */
  rewrite: Map<string, string>;
  /** Upstream tokens to drop outright. */
  drop: Set<string>;
  /** Tokens to append that pair with nothing upstream. */
  add: string[];
};

const adaptations = new Map<string, Adaptation>();

for (const marker of Object.keys(ourNova)) {
  if (!(marker in upstreamNova)) continue;

  const oursTokens = ourNova[marker].split(/\s+/).filter(Boolean);
  const upTokens = upstreamNova[marker].split(/\s+/).filter(Boolean);
  const oursSet = new Set(oursTokens);
  const upSet = new Set(upTokens);

  const dropped = upTokens.filter((t) => !oursSet.has(t));
  const added = oursTokens.filter((t) => !upSet.has(t));
  if (dropped.length === 0 && added.length === 0) continue;

  // Pair a dropped token with an added one when they are the same
  // utility behind a different variant -- that is a Kobalte attribute
  // rename (data-open: -> data-expanded:) rather than a design change.
  const rewrite = new Map<string, string>();
  const usedAdds = new Set<string>();
  for (const from of dropped) {
    const matches = added.filter(
      (to) => !usedAdds.has(to) && tail(to) === tail(from),
    );
    if (matches.length === 1) {
      rewrite.set(from, matches[0]);
      usedAdds.add(matches[0]);
    }
  }

  adaptations.set(marker, {
    rewrite,
    drop: new Set(dropped.filter((t) => !rewrite.has(t))),
    add: added.filter((t) => !usedAdds.has(t)),
  });
}

console.log(
  `learned adaptations for ${adaptations.size} marker(s) from the nova pair\n`,
);

// #######################################
//    Port each requested style
// #######################################

const SIMPLE_CN_SELECTOR = /^\.(cn-[a-z0-9-]+)$/;

for (const style of targets) {
  const source = readFileSync(
    path.join(upstreamDir, `style-${style}.css`),
    "utf8",
  );
  const root = postcss.parse(source);

  let dropCount = 0;
  let adaptCount = 0;
  let globalRenames = 0;
  const present = new Set<string>();

  root.walkRules((rule) => {
    const match = rule.selector.trim().match(SIMPLE_CN_SELECTOR);
    if (!match) return;
    const marker = match[1];

    // Allowlisted markers ship as-is to consumers, so a style must not
    // declare them: doing so would style them in the docs while shipped
    // code kept the bare marker.
    if (!used.has(marker) || STYLE_ALLOWLIST.has(marker)) {
      rule.remove();
      dropCount++;
      return;
    }
    present.add(marker);

    const adaptation = adaptations.get(marker);

    let touched = false;
    for (const node of rule.nodes ?? []) {
      if (node.type !== "atrule" || node.name !== "apply") continue;
      const tokens = node.params.trim().split(/\s+/).filter(Boolean);
      const next: string[] = [];
      for (const token of tokens) {
        if (adaptation?.drop.has(token)) {
          touched = true;
          continue;
        }
        // The per-marker map runs first so markers nova already adapted
        // reproduce byte for byte; the global pass then catches variants
        // in markers nova never touched.
        const rewritten = adaptation?.rewrite.get(token);
        if (rewritten) {
          next.push(rewritten);
          touched = true;
          continue;
        }
        const renamed = renameVariants(token);
        if (renamed !== token) {
          globalRenames++;
          touched = true;
        }
        next.push(renamed);
      }
      node.params = next.join(" ");
    }

    if (!adaptation) return;

    if (adaptation.add.length > 0) {
      const apply = (rule.nodes ?? []).find(
        (node) => node.type === "atrule" && node.name === "apply",
      );
      if (apply && apply.type === "atrule") {
        apply.params = `${apply.params} ${adaptation.add.join(" ")}`.trim();
      } else {
        rule.append(
          postcss.atRule({ name: "apply", params: adaptation.add.join(" ") }),
        );
      }
      touched = true;
    }

    if (touched) adaptCount++;
  });

  // Upstream's outer `.style-<name>` wrapper is replaced by our own,
  // nested inside @layer components so utilities keep outranking markers.
  const inner: postcss.ChildNode[] = [];
  root.each((node) => {
    if (node.type === "rule" && node.selector.trim() === `.style-${style}`) {
      for (const child of node.nodes ?? []) inner.push(child.clone());
    } else {
      inner.push(node.clone());
    }
  });

  const missing = [...used]
    .filter((marker) => !present.has(marker) && !STYLE_ALLOWLIST.has(marker))
    .sort();
  const derived = missing.filter((marker) => marker in KOBALTE_ONLY);
  const blank = missing.filter((marker) => !(marker in KOBALTE_ONLY));

  // Compose the markers upstream has no counterpart for, from this
  // style's own analogues.
  const upstreamMap = createStyleMap(source);
  const tokensOf = (marker: string) =>
    (upstreamMap[marker] ?? "").split(/\s+/).filter(Boolean);
  const composed = new Map<string, string>();
  for (const marker of derived) {
    const tokens = KOBALTE_ONLY[marker](tokensOf);
    if (tokens.length === 0) {
      throw new Error(
        `Derivation for ${marker} produced nothing in style "${style}" ` +
          `(a source marker it reads is missing upstream)`,
      );
    }
    composed.set(marker, tokens.join(" "));
  }

  const wrapper = postcss.rule({ selector: `.style-${style}` });
  wrapper.append(inner);

  if (blank.length > 0) {
    wrapper.append(
      postcss.comment({
        text:
          "MARK: Unstyled in this style\n     Empty rules declare markers this style leaves unstyled.",
      }),
    );
    for (const marker of blank) {
      wrapper.append(postcss.rule({ selector: `.${marker}` }));
    }
  }
  if (composed.size > 0) {
    wrapper.append(
      postcss.comment({
        text: "MARK: Surfaces upstream does not have\n" +
          "     Composed from this style's own analogues by port-style.ts;\n" +
          "     see KOBALTE_ONLY there for each derivation.",
      }),
    );
    for (const [marker, tokens] of composed) {
      const rule = postcss.rule({ selector: `.${marker}` });
      rule.append(postcss.atRule({ name: "apply", params: tokens }));
      wrapper.append(rule);
    }
  }

  const layer = postcss.atRule({ name: "layer", params: "components" });
  layer.append(wrapper);

  const header = `/*
 * Style tokens for the registry's \`cn-*\` marker classes, ported from the
 * upstream shadcn "${style}" style (registry/styles/style-${style}.css) by
 * ./src/scripts/port-style.ts, which replays the Kobalte adaptations
 * learned from the nova pair (data-expanded/data-highlighted attributes,
 * --kb-* CSS variables).
 *
 * The registry build inlines these tokens into shipped component code
 * (src/lib/registry/style-map.ts); the docs site imports this file at
 * runtime via app.css. Only simple \`.cn-* { @apply ... }\` rules are
 * supported by the build transform; an empty rule (\`.cn-foo {}\`)
 * declares a marker this style leaves unstyled.
 */
`;

  const output = postcss.root({ nodes: [layer] }).toString();
  writeFileSync(
    path.join(outDir, `style-${style}.css`),
    `${header}${output}\n`,
  );

  console.log(
    `${style}: ${present.size} kept, ${dropCount} dropped, ` +
      `${adaptCount} adapted (${globalRenames} global variant renames), ` +
      `${composed.size} composed, ${blank.length} blank`,
  );
}
