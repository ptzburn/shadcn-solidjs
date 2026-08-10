import process from "node:process";

export const SHADCN_SOLIDJS_URL = process.env.SHADCN_SOLIDJS_URL ??
  "https://shadcn-solidjs.com";

/** Overridable so development can point at a local docs server. */
export const REGISTRY_URL = process.env.REGISTRY_URL ??
  `${SHADCN_SOLIDJS_URL}/r`;

/**
 * Icon libraries mirror `apps/docs/src/registry/icons/icon-libraries.ts`. The
 * key doubles as the `~icons/<collection>/<name>` collection id *and* the
 * `r/icons/<library>/` path segment.
 */
export const ICON_LIBRARIES = {
  lucide: { title: "Lucide", package: "@iconify-json/lucide" },
  tabler: { title: "Tabler Icons", package: "@iconify-json/tabler" },
  ph: { title: "Phosphor", package: "@iconify-json/ph" },
  ri: { title: "Remix Icon", package: "@iconify-json/ri" },
  hugeicons: { title: "Hugeicons", package: "@iconify-json/hugeicons" },
} as const;

export type IconLibrary = keyof typeof ICON_LIBRARIES;

export const ICON_LIBRARY_NAMES = Object.keys(ICON_LIBRARIES) as IconLibrary[];

export const DEFAULT_ICON_LIBRARY: IconLibrary = "lucide";

export function isIconLibrary(value: string): value is IconLibrary {
  return value in ICON_LIBRARIES;
}

/**
 * Styles mirror `apps/docs/src/registry/styles.ts`. Each is a complete set of
 * visual tokens; the registry inlines one style's tokens into the code it
 * ships, so a component's classes differ per style.
 */
export const STYLES = {
  nova: { title: "Nova", description: "Reduced padding and margins" },
  vega: { title: "Vega", description: "Clean, neutral, and familiar" },
  maia: { title: "Maia", description: "Rounded, with generous spacing." },
  lyra: { title: "Lyra", description: "Boxy and sharp. For mono fonts." },
  mira: { title: "Mira", description: "Made for compact interfaces." },
  luma: { title: "Luma", description: "Fluid, luminous, and soft." },
  sera: { title: "Sera", description: "Editorial and typographic." },
  rhea: { title: "Rhea", description: "Like Luma but compact." },
} as const;

export type Style = keyof typeof STYLES;

export const STYLE_NAMES = Object.keys(STYLES) as Style[];

export const DEFAULT_STYLE: Style = "nova";

export function isStyle(value: string): value is Style {
  return value in STYLES;
}

/**
 * Every item — including lib and hook items — is addressable under both a
 * style and an icon library prefix, so resolving a ui item's
 * registryDependencies never needs a fallback path.
 */
export const BUILTIN_REGISTRIES = {
  "@shadcn-solidjs":
    `${REGISTRY_URL}/styles/{style}/icons/{iconLibrary}/{name}.json`,
} as const;

export const DEFAULT_REGISTRY = "@shadcn-solidjs";

/** The item index, listing every item with `files` stripped. */
export const REGISTRY_INDEX_URL = `${REGISTRY_URL}/registry.json`;

/**
 * Themes sit outside the icon-library fan-out — they carry no files and so no
 * icons — which means the item template above cannot address them. `init`
 * resolves a base color through this template instead.
 */
export const REGISTRY_THEME_URL = `${REGISTRY_URL}/themes/{name}.json`;
