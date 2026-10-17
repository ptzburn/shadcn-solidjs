import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "vite-plus/test";

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

test("adds the missing tw-animate-css import after tailwindcss", () => {
  const out = transformCssVars(FRESH, theme("zinc"));
  const lines = out.split("\n");

  expect(lines[0]).toEqual('@import "tailwindcss";');
  expect(lines[1]).toEqual('@import "tw-animate-css";');
});

test("registers a Kobalte-aware dark variant", () => {
  const out = transformCssVars(FRESH, theme("zinc"));
  expect(out).toContain("@custom-variant dark");
  expect(out, "Kobalte drives colour mode through data-kb-theme").toContain("[data-kb-theme=dark]");
});

/** `.dark` also appears inside the @custom-variant params, so match a block. */
function block(css: string, selector: string): string {
  const pattern = new RegExp(
    `^${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`,
    "m",
  );
  return css.match(pattern)?.[1] ?? "";
}

test("writes light variables to :root and dark to .dark", () => {
  const out = transformCssVars(FRESH, theme("zinc"));
  const root = block(out, ":root");
  const dark = block(out, ".dark");

  expect(root.length > 0, "expected a :root block").toBe(true);
  expect(dark.length > 0, "expected a .dark block").toBe(true);
  expect(root).toContain("--background: oklch(1 0 0);");
  expect(dark).toContain("--background:");
  expect(!dark.includes("--background: oklch(1 0 0);"), "dark should not reuse the light value").toBe(true);
});

test("maps colours into @theme inline but not radius", () => {
  const out = transformCssVars(FRESH, theme("zinc"));
  const themeBlock = out.slice(out.indexOf("@theme inline"));

  expect(themeBlock).toContain("--color-background: var(--background);");
  expect(themeBlock).toContain("--color-primary: var(--primary);");
  expect(!themeBlock.includes("--color-radius:"), "radius is not a colour and must not get a --color-* mapping").toBe(true);
});

test("emits the radius scale the components reference", () => {
  const out = transformCssVars(FRESH, theme("zinc"));
  for (const step of ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"]) {
    expect(out).toContain(`--radius-${step}:`);
  }
});

test("adds the base layer", () => {
  const out = transformCssVars(FRESH, theme("zinc"));
  expect(out).toContain("@layer base");
  expect(out).toContain("@apply border-border outline-ring/50;");
  expect(out).toContain("@apply bg-background text-foreground;");
});

test("running twice changes nothing", () => {
  const once = transformCssVars(FRESH, theme("zinc"));
  expect(transformCssVars(once, theme("zinc"))).toEqual(once);
});

test("keeps values the project already set unless told otherwise", () => {
  const existing =
    `@import "tailwindcss";\n\n:root {\n  --background: red;\n}\n`;

  const preserved = transformCssVars(existing, theme("zinc"));
  expect(preserved).toContain("--background: red;");

  const replaced = transformCssVars(existing, theme("zinc"), {
    overwrite: true,
  });
  expect(replaced).toContain("--background: oklch(1 0 0);");
});

test("an accent overlay leaves the base palette intact", () => {
  const base = transformCssVars(FRESH, theme("stone"));
  const layered = transformCssVars(base, theme("blue"), { overwrite: true });

  expect(layered).toContain("--primary: oklch(0.488 0.243 264.376);");
  expect(layered).toContain("--background: oklch(1 0 0);");
  expect(layered).toContain("--radius: 0.625rem;");
});

test("does not duplicate imports it already found", () => {
  const already = '@import "tailwindcss";\n@import "tw-animate-css";\n';
  const out = transformCssVars(already, theme("zinc"));

  expect(out.match(/@import "tailwindcss"/g)?.length).toEqual(1);
  expect(out.match(/@import "tw-animate-css"/g)?.length).toEqual(1);
});
