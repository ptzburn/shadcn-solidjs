/**
 * The stylesheet shape `init` writes, mirroring `apps/docs/src/styles/app.css`
 * so an installed component looks the same as it does in the docs.
 */

/**
 * Kobalte drives colour mode through `[data-kb-theme]`, so upstream's
 * `&:is(.dark *)` would leave every dark-mode utility inert in a Solid app
 * that uses Kobalte's colour-mode primitives.
 */
export const DARK_VARIANT =
  "(&:where(.dark, .dark *, [data-kb-theme=dark], [data-kb-theme=dark] *))";

/** Imports `init` guarantees, in order, at the top of the stylesheet. */
export const REQUIRED_IMPORTS = ["tailwindcss", "tw-animate-css"] as const;

/**
 * Animation utilities the registry relies on come from `tw-animate-css`; no
 * item declares it, so `init` owns installing it.
 */
export const BASE_DEPENDENCIES = ["tailwind-merge", "clsx"] as const;
export const BASE_DEV_DEPENDENCIES = ["tailwindcss", "tw-animate-css"] as const;

/**
 * Multiplicative rather than upstream's `calc(var(--radius) - 4px)`: this
 * registry's components reference `--radius-md` through `--radius-4xl`, and
 * the ratios come from the docs stylesheet.
 */
export const RADIUS_SCALE: Record<string, string> = {
  "--radius-sm": "calc(var(--radius) * 0.6)",
  "--radius-md": "calc(var(--radius) * 0.8)",
  "--radius-lg": "var(--radius)",
  "--radius-xl": "calc(var(--radius) * 1.4)",
  "--radius-2xl": "calc(var(--radius) * 1.8)",
  "--radius-3xl": "calc(var(--radius) * 2.2)",
  "--radius-4xl": "calc(var(--radius) * 2.6)",
};

/** Variables that are not colours and so get no `--color-*` mapping. */
export const NON_COLOR_VARS = new Set(["radius"]);

export const BASE_LAYER = {
  "*": "border-border outline-ring/50",
  body: "bg-background text-foreground",
} as const;
