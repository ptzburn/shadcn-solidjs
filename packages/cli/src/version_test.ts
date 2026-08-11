import { readFileSync } from "node:fs";
import path from "node:path";
import { assertEquals } from "@std/assert";

import { VERSION } from "./version.ts";

Deno.test("VERSION matches the version in deno.json", () => {
  const config = JSON.parse(
    readFileSync(path.join(import.meta.dirname!, "..", "deno.json"), "utf8"),
  );
  assertEquals(VERSION, config.version);
});
