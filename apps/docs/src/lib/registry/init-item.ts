/**
 * The `registry:style` item a project starts from:
 * `npx shadcn@latest init https://shadcn-solidjs.com/r/init/<base-color>.json`.
 *
 * `extends: "none"` keeps the shadcn CLI from layering its own React setup
 * (`lucide-react`, `radix-ui`) underneath. The stylesheet it writes mirrors
 * `apps/docs/src/styles/app.css`, so an installed component looks the same
 * as it does in the docs.
 */
import type { RegistryItem } from "~/registry/schema.ts";

/**
 * Kobalte drives colour mode through `[data-kb-theme]`, so the shadcn CLI's
 * own `&:is(.dark *)` would leave every dark-mode utility inert in a Solid
 * app that uses Kobalte's colour-mode primitives. The CLI still writes its
 * variant first; this one comes later in the stylesheet and wins.
 */
const DARK_VARIANT = "(&:where(.dark, .dark *, [data-kb-theme=dark], [data-kb-theme=dark] *))";

/**
 * Multiplicative rather than the CLI's `calc(var(--radius) - 4px)`: the
 * components reference `--radius-md` through `--radius-4xl`, and the ratios
 * come from the docs stylesheet.
 */
const RADIUS_SCALE: Record<string, string> = {
  "radius-sm": "calc(var(--radius) * 0.6)",
  "radius-md": "calc(var(--radius) * 0.8)",
  "radius-lg": "var(--radius)",
  "radius-xl": "calc(var(--radius) * 1.4)",
  "radius-2xl": "calc(var(--radius) * 1.8)",
  "radius-3xl": "calc(var(--radius) * 2.2)",
  "radius-4xl": "calc(var(--radius) * 2.6)",
};

/** A base colour carries the full palette; an accent overlay does not. */
export function isBaseColor(item: RegistryItem): boolean {
  return Boolean(item.cssVars?.light?.background);
}

/**
 * The init item for one base colour. `utilsUrl` is the `cn` helper every
 * component imports; no component declares it, so init installs it.
 */
export function initItem(baseColor: RegistryItem, utilsUrl: string) {
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: `init-${baseColor.name}`,
    type: "registry:style",
    title: `${baseColor.title ?? baseColor.name} base`,
    description: `Sets up a Solid project for shadcn-solidjs with the ${baseColor.name} base color.`,
    extends: "none",
    dependencies: ["clsx", "tailwind-merge"],
    devDependencies: ["tw-animate-css"],
    registryDependencies: [utilsUrl],
    cssVars: {
      theme: RADIUS_SCALE,
      light: baseColor.cssVars?.light,
      dark: baseColor.cssVars?.dark,
    },
    css: {
      '@import "tw-animate-css"': {},
      [`@custom-variant dark ${DARK_VARIANT}`]: {},
      "@layer base": {
        "*": { "@apply border-border outline-ring/50": {} },
        body: { "@apply bg-background text-foreground": {} },
      },
    },
  };
}
