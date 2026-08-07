import postcss, { type AtRule, type Root, type Rule } from "postcss";

import type { RegistryItemCssVars } from "../registry/schema.ts";
import {
  BASE_LAYER,
  DARK_VARIANT,
  NON_COLOR_VARS,
  RADIUS_SCALE,
  REQUIRED_IMPORTS,
} from "./css-conventions.ts";

/**
 * Appends declarations to a rule, replacing any already present. `raws` are
 * set explicitly so output spacing does not depend on what postcss inferred
 * from the surrounding file — which is what makes a second run a no-op.
 */
function upsertDeclarations(
  rule: Rule | AtRule,
  declarations: Record<string, string>,
): void {
  rule.raws.semicolon = true;
  rule.raws.after ??= "\n";

  for (const [property, value] of Object.entries(declarations)) {
    const existing = rule.nodes?.find(
      (node) => node.type === "decl" && node.prop === property,
    );
    if (existing && existing.type === "decl") {
      existing.value = value;
    } else {
      rule.append({
        prop: property,
        value,
        raws: { before: "\n  ", between: ": " },
      });
    }
  }
}

function findRule(root: Root, selector: string): Rule | undefined {
  let found: Rule | undefined;
  root.walkRules((rule) => {
    if (rule.selector === selector && !found) found = rule;
  });
  return found;
}

function findAtRule(
  root: Root,
  name: string,
  params?: string,
): AtRule | undefined {
  let found: AtRule | undefined;
  root.walkAtRules(name, (rule) => {
    if (found) return;
    if (params === undefined || rule.params === params) found = rule;
  });
  return found;
}

function upsertRule(
  root: Root,
  selector: string,
  declarations: Record<string, string>,
): void {
  if (Object.keys(declarations).length === 0) return;

  const existing = findRule(root, selector);
  if (existing) {
    upsertDeclarations(existing, declarations);
    return;
  }

  const rule = postcss.rule({
    selector,
    raws: { before: "\n\n", between: " " },
  });
  upsertDeclarations(rule, declarations);
  root.append(rule);
}

/**
 * Keeps `@import` at the very top, where the CSS spec requires it, and adds
 * missing ones *after* those already present so `tailwindcss` keeps its place
 * ahead of anything that builds on it.
 */
function ensureImports(root: Root): void {
  const present = new Set<string>();
  const existing: AtRule[] = [];
  root.walkAtRules("import", (rule) => {
    present.add(rule.params.replace(/^["']|["'];?$/g, ""));
    existing.push(rule);
  });

  const missing = REQUIRED_IMPORTS.filter((name) => !present.has(name));
  if (missing.length === 0) return;

  let anchor = existing.at(-1);
  for (const name of missing) {
    const rule = postcss.atRule({
      name: "import",
      params: `"${name}"`,
      raws: { before: anchor ? "\n" : "", afterName: " " },
    });
    if (anchor) anchor.after(rule);
    else root.prepend(rule);
    anchor = rule;
  }
}

function ensureDarkVariant(root: Root): void {
  const existing = findAtRule(root, "custom-variant");
  if (existing?.params.startsWith("dark")) return;

  const imports: AtRule[] = [];
  root.walkAtRules("import", (rule) => {
    imports.push(rule);
  });
  const anchor = imports.at(-1);

  const variant = postcss.atRule({
    name: "custom-variant",
    params: `dark ${DARK_VARIANT}`,
    raws: { before: "\n\n", afterName: " " },
  });

  if (anchor) anchor.after(variant);
  else root.prepend(variant);
}

/**
 * Tailwind v4 derives utilities from the `@theme` namespace, so a variable in
 * `:root` is inert until it is mapped here.
 */
function upsertTheme(root: Root, variableNames: string[]): void {
  const mappings: Record<string, string> = {};
  for (const name of variableNames) {
    if (NON_COLOR_VARS.has(name)) continue;
    mappings[`--color-${name}`] = `var(--${name})`;
  }
  Object.assign(mappings, RADIUS_SCALE);

  const existing = findAtRule(root, "theme", "inline");
  if (existing) {
    upsertDeclarations(existing, mappings);
    return;
  }

  const theme = postcss.atRule({
    name: "theme",
    params: "inline",
    raws: { before: "\n\n", afterName: " ", between: " " },
  });
  upsertDeclarations(theme, mappings);
  root.append(theme);
}

function ensureBaseLayer(root: Root): void {
  if (findAtRule(root, "layer", "base")) return;

  const layer = postcss.atRule({
    name: "layer",
    params: "base",
    raws: { before: "\n\n", afterName: " ", between: " " },
  });

  layer.raws.after = "\n";
  for (const [selector, apply] of Object.entries(BASE_LAYER)) {
    const rule = postcss.rule({
      selector,
      raws: { before: "\n  ", between: " ", after: "\n  ", semicolon: true },
    });
    rule.append({
      name: "apply",
      params: apply,
      raws: { before: "\n    ", afterName: " " },
    });
    layer.append(rule);
  }

  root.append(layer);
}

export interface TransformCssVarsOptions {
  /** Replace values already present rather than keeping the project's. */
  overwrite?: boolean;
}

/**
 * Writes a theme's variables into a Tailwind v4 stylesheet: `:root` for light,
 * `.dark` for dark, and the `@theme inline` mappings that make them usable.
 *
 * Idempotent — running it twice produces the same stylesheet.
 */
export function transformCssVars(
  input: string,
  cssVars: RegistryItemCssVars,
  options: TransformCssVarsOptions = {},
): string {
  const root = postcss.parse(input);

  ensureImports(root);
  ensureDarkVariant(root);

  const light = cssVars.light ?? {};
  const dark = cssVars.dark ?? {};

  const toDeclarations = (vars: Record<string, string>) =>
    Object.fromEntries(
      Object.entries(vars).map(([name, value]) => [`--${name}`, value]),
    );

  const existingRoot = findRule(root, ":root");
  const lightDeclarations = toDeclarations(light);
  if (existingRoot && !options.overwrite) {
    // Keep whatever the project already chose; only add what is missing.
    for (const node of existingRoot.nodes ?? []) {
      if (node.type === "decl") delete lightDeclarations[node.prop];
    }
  }

  upsertRule(root, ":root", lightDeclarations);
  upsertRule(root, ".dark", toDeclarations(dark));
  upsertTheme(root, [
    ...Object.keys(light),
    ...Object.keys(cssVars.theme ?? {}),
  ]);
  ensureBaseLayer(root);

  return root.toString();
}
