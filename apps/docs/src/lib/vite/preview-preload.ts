import { readFileSync } from "node:fs";
import type { Plugin } from "vite";

const REGISTRY_INDEX = "~/__registry__/index.tsx";

/**
 * The registry names a docs page previews, in source order. Blocks are left
 * out: they render in an iframe, not from the page's own bundle.
 */
export function previewNames(source: string): string[] {
  const names: string[] = [];
  for (const [index, segment] of source.split("<ComponentPreview").entries()) {
    if (index === 0) continue;
    // A tag can span lines and its class attributes can hold a `>`
    // (`[&>div]:…`), so read up to the self-closing end instead.
    const tag = segment.slice(0, segment.indexOf("/>") + 1 || undefined);
    const name = /\bname="([^"]+)"/.exec(tag)?.[1];
    if (name && !/\btype="block"/.test(tag) && !names.includes(name)) names.push(name);
  }
  return names;
}

/**
 * Starts loading a docs page's preview components as soon as the page's own
 * module runs. The router's intent preload imports that module when a link
 * is hovered, so the previews load then too, instead of in a second round
 * after the click once the page renders and reaches each lazy component.
 */
export function previewPreload(): Plugin {
  return {
    name: "docs-preview-preload",
    enforce: "post",
    transform(code, id) {
      const file = id.split("?")[0];
      if (!file.endsWith(".mdx")) return;
      const names = previewNames(readFileSync(file, "utf8"));
      if (names.length === 0) return;
      return {
        code: `${code}
import { Index as __previewIndex } from "${REGISTRY_INDEX}";
for (const name of ${JSON.stringify(names)}) __previewIndex[name]?.component?.preload?.();
`,
        map: null,
      };
    },
  };
}
