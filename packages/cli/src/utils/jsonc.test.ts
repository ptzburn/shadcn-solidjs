import { expect, test } from "vite-plus/test";

import { parseJsonc } from "./jsonc.ts";

test("parses plain JSON", () => {
  expect(parseJsonc('{"a": 1}')).toEqual({ a: 1 });
});

test("strips line and block comments", () => {
  expect(parseJsonc(`{
      // leading
      "a": 1, /* inline */
      "b": 2
    }`)).toEqual({ a: 1, b: 2 });
});

test("strips trailing commas in objects and arrays", () => {
  expect(parseJsonc('{"a": [1, 2,],}')).toEqual({ a: [1, 2] });
});

test("keeps a // sequence inside a string", () => {
  expect(parseJsonc('{"url": "https://example.com/r/{name}.json"}')).toEqual({ url: "https://example.com/r/{name}.json" });
});

test("keeps a comma inside a string before a brace", () => {
  expect(parseJsonc('{"a": "value,}"}')).toEqual({ a: "value,}" });
});

test("keeps an escaped quote inside a string", () => {
  expect(parseJsonc('{"a": "say \\"hi\\", ok"}')).toEqual({ a: 'say "hi", ok' });
});

test("reads a realistic deno.jsonc", () => {
  const parsed = parseJsonc(`{
    // workspace root
    "nodeModulesDir": "manual",
    "imports": {
      "~/": "./src/",
      "solid-js": "npm:solid-js@^1.9.14", // pinned
    },
  }`) as Record<string, unknown>;

  expect(parsed.nodeModulesDir).toEqual("manual");
  expect(parsed.imports).toEqual({
    "~/": "./src/",
    "solid-js": "npm:solid-js@^1.9.14",
  });
});
