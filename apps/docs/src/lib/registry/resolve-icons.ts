/**
 * IconPlaceholder resolution, shared by the registry build and the docs
 * MDX pipeline. Markers in authored components are replaced with concrete
 * `~icons/<library>/<name>` imports (unplugin-icons / @iconify-json on
 * the consumer side); the marker component itself never ships.
 */
import {
  type IconLibrary,
  iconLibraryNames,
} from "~/registry/icons/icon-libraries.ts";

const PLACEHOLDER_IMPORT_RE =
  /^import \{ IconPlaceholder \} from "~\/registry\/icons\/icon-placeholder\.tsx";$\n?/m;
const PLACEHOLDER_TAG_RE = /<IconPlaceholder\b[\s\S]*?\/>/g;
const LIB_ATTRS_RE = new RegExp(
  `\\s*(?:${iconLibraryNames.join("|")})="[^"]*"`,
  "g",
);

function pascalCase(iconName: string): string {
  return iconName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * Replaces IconPlaceholder markers with the concrete icon component of the
 * given library and swaps the placeholder import for `~icons` imports.
 */
export function resolveIcons(
  source: string,
  library: IconLibrary,
): { code: string; icons: string[] } {
  const icons = new Set<string>();
  let code = source.replace(PLACEHOLDER_TAG_RE, (tag) => {
    const name = tag.match(new RegExp(`\\b${library}="([^"]+)"`))?.[1];
    if (!name) {
      throw new Error(`IconPlaceholder is missing the "${library}" prop`);
    }
    icons.add(name);
    return tag
      .replace(LIB_ATTRS_RE, "")
      .replace(/^<IconPlaceholder/, `<Icon${pascalCase(name)}`);
  });
  if (icons.size === 0) {
    return { code, icons: [] };
  }
  if (!PLACEHOLDER_IMPORT_RE.test(code)) {
    throw new Error("IconPlaceholder used without its import");
  }
  const sorted = [...icons].sort();
  const imports = sorted
    .map((name) =>
      `import Icon${pascalCase(name)} from "~icons/${library}/${name}";`
    )
    .join("\n");
  code = code.replace(PLACEHOLDER_IMPORT_RE, `${imports}\n`);
  return { code, icons: sorted };
}
