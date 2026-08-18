/**
 * The styles this registry ships.
 *
 * Each entry has a matching `styles/style-<name>.css` holding the tokens
 * for that style's `cn-*` markers. The registry build inlines those
 * tokens per style, and the docs site scopes them under `.style-<name>`
 * so the switcher can move between them at runtime.
 *
 * Names, titles and descriptions mirror upstream's `registry/styles.tsx`
 * so a component looks the same here as it does on ui.shadcn.com.
 */
export type Style = {
  name: string;
  title: string;
  description: string;
};

export const styles = [
  {
    name: "nova",
    title: "Nova",
    description: "Reduced padding and margins",
  },
  {
    name: "vega",
    title: "Vega",
    description: "Clean, neutral, and familiar",
  },
  {
    name: "maia",
    title: "Maia",
    description: "Rounded, with generous spacing.",
  },
  {
    name: "lyra",
    title: "Lyra",
    description: "Boxy and sharp. For mono fonts.",
  },
  {
    name: "mira",
    title: "Mira",
    description: "Made for compact interfaces.",
  },
  {
    name: "luma",
    title: "Luma",
    description: "Fluid, luminous, and soft.",
  },
  {
    name: "sera",
    title: "Sera",
    description: "Editorial and typographic.",
  },
  {
    name: "rhea",
    title: "Rhea",
    description: "Like Luma but compact.",
  },
] as const satisfies readonly Style[];

export type StyleName = (typeof styles)[number]["name"];

export const styleNames = styles.map((style) => style.name) as StyleName[];

/** The style shipped at the registry's unprefixed paths. */
export const defaultStyle: StyleName = "nova";

export function isStyle(value: string): value is StyleName {
  return styleNames.includes(value as StyleName);
}
