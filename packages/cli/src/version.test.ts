import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "vite-plus/test";

import { DIST_TAG, VERSION } from "./version.ts";

const pkg = JSON.parse(readFileSync(path.join(import.meta.dirname!, "..", "package.json"), "utf8"));

test("VERSION matches the version in package.json", () => {
  expect(VERSION).toEqual(pkg.version);
});

test("publishConfig.tag matches the version line", () => {
  expect(pkg.publishConfig.tag).toBe(VERSION.includes("-") ? "beta" : "latest");
  expect(pkg.publishConfig.tag).toBe(DIST_TAG);
});
