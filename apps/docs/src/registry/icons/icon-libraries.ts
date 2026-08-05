/**
 * Icon libraries the registry can resolve to. Every library is consumed
 * through its Iconify data package via unplugin-icons, so the prop name on
 * `IconPlaceholder` doubles as the `~icons/<collection>/<name>` collection id.
 */
export const iconLibraries = {
  lucide: {
    title: "Lucide",
    package: "@iconify-json/lucide",
  },
  tabler: {
    title: "Tabler Icons",
    package: "@iconify-json/tabler",
  },
  ph: {
    title: "Phosphor",
    package: "@iconify-json/ph",
  },
  ri: {
    title: "Remix Icon",
    package: "@iconify-json/ri",
  },
  hugeicons: {
    title: "Hugeicons",
    package: "@iconify-json/hugeicons",
  },
} as const;

export type IconLibrary = keyof typeof iconLibraries;

export const iconLibraryNames = Object.keys(iconLibraries) as IconLibrary[];

/** Library the docs site renders with and the default registry output uses. */
export const defaultIconLibrary: IconLibrary = "lucide";
