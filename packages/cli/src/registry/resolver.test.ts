import path from "node:path";
import { expect, test } from "vite-plus/test";

import { RegistryNotFoundError } from "./errors.ts";
import { clearRegistryCache } from "./fetcher.ts";
import { resolveRegistryItems, resolveRegistryTree } from "./resolver.ts";

/**
 * Resolves against the registry this repo actually builds, so the tests break
 * when the emitted shape drifts rather than agreeing with a stale fixture.
 */
const R_DIR = path.resolve(
  import.meta.dirname!,
  "../../../../apps/docs/public/r",
);

function options(iconLibrary = "lucide", style = "nova") {
  return {
    iconLibrary,
    style,
    registries: {
      "@shadcn-solidjs":
        `${R_DIR}/styles/{style}/icons/{iconLibrary}/{name}.json`,
    },
    // Without this the bare-name theme retry falls back to the public
    // registry, so a miss becomes a network round-trip instead of a local one.
    themeUrl: `${R_DIR}/themes/{name}.json`,
  };
}

function names(items: { name: string }[]) {
  return items.map((item) => item.name);
}

test("resolves a single item with no dependencies", async () => {
  clearRegistryCache();
  const items = await resolveRegistryItems(["button"], options());
  expect(names(items)).toEqual(["button"]);
});

test("resolves registryDependencies transitively", async () => {
  clearRegistryCache();
  const items = await resolveRegistryItems(["sidebar"], options());

  for (
    const expected of ["button", "separator", "tooltip", "use-media-query"]
  ) {
    expect(names(items).includes(expected), `expected "${expected}" to be pulled in, got ${names(items).join(", ")}`).toBe(true);
  }
});

test("orders dependencies before the items that need them", async () => {
  clearRegistryCache();
  const items = await resolveRegistryItems(["sidebar"], options());
  const order = names(items);

  for (const dep of ["button", "input", "separator", "tooltip"]) {
    expect(order.indexOf(dep) < order.indexOf("sidebar"), `"${dep}" should be written before "sidebar"`).toBe(true);
  }
});

test("deduplicates an item requested twice", async () => {
  clearRegistryCache();
  const items = await resolveRegistryItems(["button", "button"], options());
  expect(names(items)).toEqual(["button"]);
});

test("deduplicates an item reached by two paths", async () => {
  clearRegistryCache();
  const items = await resolveRegistryItems(
    ["sidebar", "button"],
    options(),
  );
  expect(names(items).filter((name) => name === "button").length).toEqual(1);
});

test("selects the icon library variant", async () => {
  clearRegistryCache();
  const tree = await resolveRegistryTree(["accordion"], options("tabler"));

  expect(tree.devDependencies.includes("@iconify-json/tabler"), `expected the tabler icon package, got ${tree.devDependencies.join(", ")}`).toBe(true);
  expect(tree.files[0].content?.includes("~icons/tabler/"), "expected tabler icon imports in the emitted content").toBe(true);
});

test("the default icon library is lucide", async () => {
  clearRegistryCache();
  const tree = await resolveRegistryTree(["accordion"], options());

  expect(tree.devDependencies.includes("@iconify-json/lucide")).toBe(true);
  expect(tree.files[0].content?.includes("~icons/lucide/")).toBe(true);
});

test("selects the style variant", async () => {
  clearRegistryCache();
  const tree = await resolveRegistryTree(["button"], options("lucide", "sera"));

  const content = tree.files[0].content ?? "";
  // sera sets buttons in uppercase with tracked-out letterforms; nova does
  // not. Asserting on tokens the styles genuinely disagree about proves the
  // style reached the emitted code, not just the URL.
  expect(content.includes("uppercase") && content.includes("tracking-widest"), "expected sera's uppercase button tokens in the emitted content").toBe(true);
});

test("the default style is nova", async () => {
  clearRegistryCache();
  const tree = await resolveRegistryTree(["button"], {
    iconLibrary: "lucide",
    registries: {
      "@shadcn-solidjs":
        `${R_DIR}/styles/{style}/icons/{iconLibrary}/{name}.json`,
    },
  });

  const content = tree.files[0].content ?? "";
  expect(content.includes("rounded-[min("), "expected nova's button radius").toBe(true);
  expect(!content.includes("tracking-widest")).toBe(true);
});

test("the unprefixed paths still resolve the default style", async () => {
  clearRegistryCache();
  // Registries pinned before styles existed address items without a style
  // segment; the build keeps writing the default style there.
  const tree = await resolveRegistryTree(["button"], {
    iconLibrary: "lucide",
    registries: {
      "@shadcn-solidjs": `${R_DIR}/icons/{iconLibrary}/{name}.json`,
    },
  });

  expect(tree.files[0].content?.includes("rounded-[min(")).toBe(true);
});

test("merges dependencies across the resolved tree", async () => {
  clearRegistryCache();
  const tree = await resolveRegistryTree(["sidebar"], options());

  expect(tree.dependencies.some((dep) => dep.startsWith("@kobalte/core")), "should carry the Kobalte dependency (possibly pinned)").toBe(true);
  expect(tree.dependencies.length, "dependencies should be deduplicated").toEqual(new Set(tree.dependencies).size);
});

test("ships lib and hook items under every icon prefix", async () => {
  clearRegistryCache();
  const tree = await resolveRegistryTree(["utils"], options("hugeicons"));

  expect(tree.files.length).toEqual(1);
  expect(tree.files[0].type).toEqual("registry:lib");
  expect(tree.dependencies.includes("clsx")).toBe(true);
  expect(tree.dependencies.includes("tailwind-merge")).toBe(true);
});

test("sorts theme items to the front", async () => {
  clearRegistryCache();
  // Themes are emitted to `r/themes/`, outside the icon-library fan-out, so
  // they need their own template. This doubles as the namespaced-registry test.
  const items = await resolveRegistryItems(["button", "@theme/blue"], {
    ...options(),
    registries: {
      "@shadcn-solidjs":
        `${R_DIR}/styles/{style}/icons/{iconLibrary}/{name}.json`,
      "@theme": `${R_DIR}/themes/{name}.json`,
    },
  });
  expect(names(items)).toEqual(["blue", "button"]);
});

test("reports a missing item rather than failing silently", async () => {
  clearRegistryCache();
  await await expect((() => resolveRegistryItems(["does-not-exist"], options()))()).rejects.toThrow(RegistryNotFoundError);
});
