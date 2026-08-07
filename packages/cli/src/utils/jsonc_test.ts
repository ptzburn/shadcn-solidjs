import { assertEquals } from "@std/assert";

import { parseJsonc } from "./jsonc.ts";

Deno.test("parses plain JSON", () => {
  assertEquals(parseJsonc('{"a": 1}'), { a: 1 });
});

Deno.test("strips line and block comments", () => {
  assertEquals(
    parseJsonc(`{
      // leading
      "a": 1, /* inline */
      "b": 2
    }`),
    { a: 1, b: 2 },
  );
});

Deno.test("strips trailing commas in objects and arrays", () => {
  assertEquals(parseJsonc('{"a": [1, 2,],}'), { a: [1, 2] });
});

Deno.test("keeps a // sequence inside a string", () => {
  assertEquals(
    parseJsonc('{"url": "https://example.com/r/{name}.json"}'),
    { url: "https://example.com/r/{name}.json" },
  );
});

Deno.test("keeps a comma inside a string before a brace", () => {
  assertEquals(parseJsonc('{"a": "value,}"}'), { a: "value,}" });
});

Deno.test("keeps an escaped quote inside a string", () => {
  assertEquals(parseJsonc('{"a": "say \\"hi\\", ok"}'), { a: 'say "hi", ok' });
});

Deno.test("reads a realistic deno.jsonc", () => {
  const parsed = parseJsonc(`{
    // workspace root
    "nodeModulesDir": "manual",
    "imports": {
      "~/": "./src/",
      "solid-js": "npm:solid-js@^1.9.14", // pinned
    },
  }`) as Record<string, unknown>;

  assertEquals(parsed.nodeModulesDir, "manual");
  assertEquals(parsed.imports, {
    "~/": "./src/",
    "solid-js": "npm:solid-js@^1.9.14",
  });
});
