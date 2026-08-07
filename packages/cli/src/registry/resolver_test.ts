import { assert, assertEquals, assertRejects } from "@std/assert";
import path from "node:path";

import { clearRegistryCache } from "./fetcher.ts";
import { resolveRegistryItems, resolveRegistryTree } from "./resolver.ts";
import { RegistryNotFoundError } from "./errors.ts";

/**
 * Resolves against the registry this repo actually builds, so the tests break
 * when the emitted shape drifts rather than agreeing with a stale fixture.
 */
const R_DIR = path.resolve(
  import.meta.dirname!,
  "../../../../apps/docs/public/r",
);

function options(iconLibrary = "lucide") {
  return {
    iconLibrary,
    registries: {
      "@shadcn-solid": `${R_DIR}/icons/{iconLibrary}/{name}.json`,
    },
  };
}

function names(items: { name: string }[]) {
  return items.map((item) => item.name);
}

Deno.test("resolves a single item with no dependencies", async () => {
  clearRegistryCache();
  const items = await resolveRegistryItems(["button"], options());
  assertEquals(names(items), ["button"]);
});

Deno.test("resolves registryDependencies transitively", async () => {
  clearRegistryCache();
  const items = await resolveRegistryItems(["sidebar"], options());

  for (
    const expected of ["button", "separator", "tooltip", "use-media-query"]
  ) {
    assert(
      names(items).includes(expected),
      `expected "${expected}" to be pulled in, got ${names(items).join(", ")}`,
    );
  }
});

Deno.test("orders dependencies before the items that need them", async () => {
  clearRegistryCache();
  const items = await resolveRegistryItems(["sidebar"], options());
  const order = names(items);

  for (const dep of ["button", "input", "separator", "tooltip"]) {
    assert(
      order.indexOf(dep) < order.indexOf("sidebar"),
      `"${dep}" should be written before "sidebar"`,
    );
  }
});

Deno.test("deduplicates an item requested twice", async () => {
  clearRegistryCache();
  const items = await resolveRegistryItems(["button", "button"], options());
  assertEquals(names(items), ["button"]);
});

Deno.test("deduplicates an item reached by two paths", async () => {
  clearRegistryCache();
  const items = await resolveRegistryItems(
    ["sidebar", "button"],
    options(),
  );
  assertEquals(names(items).filter((name) => name === "button").length, 1);
});

Deno.test("selects the icon library variant", async () => {
  clearRegistryCache();
  const tree = await resolveRegistryTree(["accordion"], options("tabler"));

  assert(
    tree.devDependencies.includes("@iconify-json/tabler"),
    `expected the tabler icon package, got ${tree.devDependencies.join(", ")}`,
  );
  assert(
    tree.files[0].content?.includes("~icons/tabler/"),
    "expected tabler icon imports in the emitted content",
  );
});

Deno.test("the default icon library is lucide", async () => {
  clearRegistryCache();
  const tree = await resolveRegistryTree(["accordion"], options());

  assert(tree.devDependencies.includes("@iconify-json/lucide"));
  assert(tree.files[0].content?.includes("~icons/lucide/"));
});

Deno.test("merges dependencies across the resolved tree", async () => {
  clearRegistryCache();
  const tree = await resolveRegistryTree(["sidebar"], options());

  assert(tree.dependencies.includes("@kobalte/core"));
  assertEquals(
    tree.dependencies.length,
    new Set(tree.dependencies).size,
    "dependencies should be deduplicated",
  );
});

Deno.test("ships lib and hook items under every icon prefix", async () => {
  clearRegistryCache();
  const tree = await resolveRegistryTree(["utils"], options("hugeicons"));

  assertEquals(tree.files.length, 1);
  assertEquals(tree.files[0].type, "registry:lib");
  assert(tree.dependencies.includes("clsx"));
  assert(tree.dependencies.includes("tailwind-merge"));
});

Deno.test("sorts theme items to the front", async () => {
  clearRegistryCache();
  // Themes are emitted to `r/themes/`, outside the icon-library fan-out, so
  // they need their own template. This doubles as the namespaced-registry test.
  const items = await resolveRegistryItems(["button", "@theme/blue"], {
    ...options(),
    registries: {
      "@shadcn-solid": `${R_DIR}/icons/{iconLibrary}/{name}.json`,
      "@theme": `${R_DIR}/themes/{name}.json`,
    },
  });
  assertEquals(names(items), ["blue", "button"]);
});

Deno.test("reports a missing item rather than failing silently", async () => {
  clearRegistryCache();
  await assertRejects(
    () => resolveRegistryItems(["does-not-exist"], options()),
    RegistryNotFoundError,
  );
});
