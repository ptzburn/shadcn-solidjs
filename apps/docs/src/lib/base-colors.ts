/**
 * The base colors the docs site can render in. Neutral is the site's own
 * palette in app.css; the others override it from styles/base-colors.css,
 * scoped under `.base-<name>` on the root element. The set and values
 * are the shadcn base themes; `dot` is each palette's muted-foreground,
 * shown as the swatch in the customizer.
 */
export const baseColors = [
  {
    name: "neutral",
    title: "Neutral",
    dot: { light: "oklch(0.556 0 0)", dark: "oklch(0.708 0 0)" },
  },
  {
    name: "stone",
    title: "Stone",
    dot: {
      light: "oklch(0.553 0.013 58.071)",
      dark: "oklch(0.709 0.01 56.259)",
    },
  },
  {
    name: "zinc",
    title: "Zinc",
    dot: {
      light: "oklch(0.552 0.016 285.938)",
      dark: "oklch(0.705 0.015 286.067)",
    },
  },
  {
    name: "mauve",
    title: "Mauve",
    dot: {
      light: "oklch(0.542 0.034 322.5)",
      dark: "oklch(0.711 0.019 323.02)",
    },
  },
  {
    name: "olive",
    title: "Olive",
    dot: { light: "oklch(0.58 0.031 107.3)", dark: "oklch(0.737 0.021 106.9)" },
  },
  {
    name: "mist",
    title: "Mist",
    dot: { light: "oklch(0.56 0.021 213.5)", dark: "oklch(0.723 0.014 214.4)" },
  },
  {
    name: "taupe",
    title: "Taupe",
    dot: { light: "oklch(0.547 0.021 43.1)", dark: "oklch(0.714 0.014 41.2)" },
  },
] as const;

export type BaseColorName = (typeof baseColors)[number]["name"];

export const defaultBaseColor: BaseColorName = "neutral";

export function isBaseColor(value: string): value is BaseColorName {
  return baseColors.some((base) => base.name === value);
}
