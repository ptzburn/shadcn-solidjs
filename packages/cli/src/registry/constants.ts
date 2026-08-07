import process from "node:process";

export const SHADCN_SOLID_URL = process.env.SHADCN_SOLID_URL ??
  "https://shadcn-solid.com";

/** Overridable so development can point at a local docs server. */
export const REGISTRY_URL = process.env.REGISTRY_URL ??
  `${SHADCN_SOLID_URL}/r`;

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
 * Every item — including lib and hook items — is addressable under an icon
 * library prefix, so resolving a ui item's registryDependencies never needs a
 * fallback path. `{iconLibrary}` is this registry's analogue of upstream's
 * `{style}` placeholder.
 */
export const BUILTIN_REGISTRIES = {
  "@shadcn-solid": `${REGISTRY_URL}/icons/{iconLibrary}/{name}.json`,
} as const;

export const DEFAULT_REGISTRY = "@shadcn-solid";

/** The item index, listing every item with `files` stripped. */
export const REGISTRY_INDEX_URL = `${REGISTRY_URL}/registry.json`;

/**
 * Themes sit outside the icon-library fan-out — they carry no files and so no
 * icons — which means the item template above cannot address them. `init`
 * resolves a base color through this template instead.
 */
export const REGISTRY_THEME_URL = `${REGISTRY_URL}/themes/{name}.json`;
