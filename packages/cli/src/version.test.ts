import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "vite-plus/test";

import { VERSION } from "./version.ts";

test("VERSION matches the version in package.json", () => {
  const pkg = JSON.parse(
    readFileSync(path.join(import.meta.dirname!, "..", "package.json"), "utf8"),
  );
  expect(VERSION).toEqual(pkg.version);
});
