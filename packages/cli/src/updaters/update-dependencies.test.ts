import { expect, test } from "vite-plus/test";

import { bareName, selectNewSpecs } from "./update-dependencies.ts";

test("strips a version from a spec, scoped or not", () => {
  expect(bareName("clsx")).toEqual("clsx");
  expect(bareName("clsx@^2.1.1")).toEqual("clsx");
  expect(bareName("@kobalte/core")).toEqual("@kobalte/core");
  expect(bareName("@kobalte/core@^0.13.12")).toEqual("@kobalte/core");
});

test("keeps a bare name the project does not declare", () => {
  const { install, present } = selectNewSpecs(["@kobalte/core", "clsx"], new Set(["clsx"]));
  expect(install).toEqual(["@kobalte/core"]);
  expect(present).toEqual(["clsx"]);
});

test("never rewrites a range the project already pinned", () => {
  const { install } = selectNewSpecs(["@kobalte/core"], new Set(["@kobalte/core"]));
  expect(install, "an existing dependency must be left alone").toEqual([]);
});

test("a spec carrying its own version is always installed", () => {
  const { install } = selectNewSpecs(["tailwind-merge@^3.6.0"], new Set(["tailwind-merge"]));
  expect(install).toEqual(["tailwind-merge@^3.6.0"]);
});
