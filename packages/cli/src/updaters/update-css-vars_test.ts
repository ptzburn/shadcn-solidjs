import { readFileSync } from "node:fs";
import path from "node:path";
import { assert, assertEquals, assertStringIncludes } from "@std/assert";

import type { RegistryItemCssVars } from "../registry/schema.ts";
import { transformCssVars } from "./update-css-vars.ts";

const THEMES = path.resolve(
  import.meta.dirname!,
  "../../../../apps/docs/public/r/themes",
);

function theme(name: string): RegistryItemCssVars {
  return JSON.parse(readFileSync(path.join(THEMES, `${name}.json`), "utf8"))
    .cssVars;
}

const FRESH = '@import "tailwindcss";\n';

Deno.test("adds the missing tw-animate-css import after tailwindcss", () => {
  const out = transformCssVars(FRESH, theme("zinc"));
  const lines = out.split("\n");

  assertEquals(lines[0], '@import "tailwindcss";');
  assertEquals(lines[1], '@import "tw-animate-css";');
});

Deno.test("registers a Kobalte-aware dark variant", () => {
  const out = transformCssVars(FRESH, theme("zinc"));
  assertStringIncludes(out, "@custom-variant dark");
  assertStringIncludes(
    out,
    "[data-kb-theme=dark]",
    "Kobalte drives colour mode through data-kb-theme",
  );
});

/** `.dark` also appears inside the @custom-variant params, so match a block. */
function block(css: string, selector: string): string {
  const pattern = new RegExp(
    `^${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`,
    "m",
  );
  return css.match(pattern)?.[1] ?? "";
}

Deno.test("writes light variables to :root and dark to .dark", () => {
  const out = transformCssVars(FRESH, theme("zinc"));
  const root = block(out, ":root");
  const dark = block(out, ".dark");

  assert(root.length > 0, "expected a :root block");
  assert(dark.length > 0, "expected a .dark block");
  assertStringIncludes(root, "--background: oklch(1 0 0);");
  assertStringIncludes(dark, "--background:");
  assert(
    !dark.includes("--background: oklch(1 0 0);"),
    "dark should not reuse the light value",
  );
});

Deno.test("maps colours into @theme inline but not radius", () => {
  const out = transformCssVars(FRESH, theme("zinc"));
  const themeBlock = out.slice(out.indexOf("@theme inline"));

  assertStringIncludes(themeBlock, "--color-background: var(--background);");
  assertStringIncludes(themeBlock, "--color-primary: var(--primary);");
  assert(
    !themeBlock.includes("--color-radius:"),
    "radius is not a colour and must not get a --color-* mapping",
  );
});

Deno.test("emits the radius scale the components reference", () => {
  const out = transformCssVars(FRESH, theme("zinc"));
  for (const step of ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"]) {
    assertStringIncludes(out, `--radius-${step}:`);
  }
});

Deno.test("adds the base layer", () => {
  const out = transformCssVars(FRESH, theme("zinc"));
  assertStringIncludes(out, "@layer base");
  assertStringIncludes(out, "@apply border-border outline-ring/50;");
  assertStringIncludes(out, "@apply bg-background text-foreground;");
});

Deno.test("running twice changes nothing", () => {
  const once = transformCssVars(FRESH, theme("zinc"));
  assertEquals(transformCssVars(once, theme("zinc")), once);
});

Deno.test("keeps values the project already set unless told otherwise", () => {
  const existing =
    `@import "tailwindcss";\n\n:root {\n  --background: red;\n}\n`;

  const preserved = transformCssVars(existing, theme("zinc"));
  assertStringIncludes(preserved, "--background: red;");

  const replaced = transformCssVars(existing, theme("zinc"), {
    overwrite: true,
  });
  assertStringIncludes(replaced, "--background: oklch(1 0 0);");
});

Deno.test("an accent overlay leaves the base palette intact", () => {
  const base = transformCssVars(FRESH, theme("stone"));
  const layered = transformCssVars(base, theme("blue"), { overwrite: true });

  assertStringIncludes(layered, "--primary: oklch(0.488 0.243 264.376);");
  assertStringIncludes(layered, "--background: oklch(1 0 0);");
  assertStringIncludes(layered, "--radius: 0.625rem;");
});

Deno.test("does not duplicate imports it already found", () => {
  const already = '@import "tailwindcss";\n@import "tw-animate-css";\n';
  const out = transformCssVars(already, theme("zinc"));

  assertEquals(out.match(/@import "tailwindcss"/g)?.length, 1);
  assertEquals(out.match(/@import "tw-animate-css"/g)?.length, 1);
});
