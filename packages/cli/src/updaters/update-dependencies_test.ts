import { assertEquals } from "@std/assert";

import { bareName, selectNewSpecs } from "./update-dependencies.ts";

Deno.test("strips a version from a spec, scoped or not", () => {
  assertEquals(bareName("clsx"), "clsx");
  assertEquals(bareName("clsx@^2.1.1"), "clsx");
  assertEquals(bareName("@kobalte/core"), "@kobalte/core");
  assertEquals(bareName("@kobalte/core@^0.13.12"), "@kobalte/core");
});

Deno.test("keeps a bare name the project does not declare", () => {
  const { install, present } = selectNewSpecs(
    ["@kobalte/core", "clsx"],
    new Set(["clsx"]),
  );
  assertEquals(install, ["@kobalte/core"]);
  assertEquals(present, ["clsx"]);
});

Deno.test("never rewrites a range the project already pinned", () => {
  const { install } = selectNewSpecs(
    ["@kobalte/core"],
    new Set(["@kobalte/core"]),
  );
  assertEquals(install, [], "an existing dependency must be left alone");
});

Deno.test("a spec carrying its own version is always installed", () => {
  const { install } = selectNewSpecs(
    ["tailwind-merge@^3.6.0"],
    new Set(["tailwind-merge"]),
  );
  assertEquals(install, ["tailwind-merge@^3.6.0"]);
});
