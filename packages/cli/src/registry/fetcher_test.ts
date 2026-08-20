import { assertEquals, assertRejects } from "@std/assert";

import { RegistryFetchError, RegistryNotFoundError } from "./errors.ts";
import { clearRegistryCache, fetchJson } from "./fetcher.ts";

function withStubbedFetch(
  response: () => Response,
  run: () => Promise<void>,
): Promise<void> {
  const original = globalThis.fetch;
  globalThis.fetch = () => Promise.resolve(response());
  return run().finally(() => {
    globalThis.fetch = original;
  });
}

Deno.test("an HTML body reads as a missing item, not a parse failure", async () => {
  clearRegistryCache();
  await withStubbedFetch(
    () =>
      new Response('<!DOCTYPE html><html lang="en"></html>', {
        status: 200,
        headers: { "content-type": "text/html" },
      }),
    async () => {
      await assertRejects(
        () => fetchJson({ url: "https://example.test/r/gone.json" }),
        RegistryNotFoundError,
      );
    },
  );
});

Deno.test("JSON served as text/plain still parses", async () => {
  clearRegistryCache();
  await withStubbedFetch(
    () =>
      new Response('{"name":"button"}', {
        status: 200,
        headers: { "content-type": "text/plain" },
      }),
    async () => {
      const raw = await fetchJson({
        url: "https://example.test/r/button.json",
      });
      assertEquals(raw, { name: "button" });
    },
  );
});

Deno.test("a malformed non-HTML body reports a fetch failure", async () => {
  clearRegistryCache();
  await withStubbedFetch(
    () =>
      new Response("not json at all", {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    async () => {
      await assertRejects(
        () => fetchJson({ url: "https://example.test/r/broken.json" }),
        RegistryFetchError,
      );
    },
  );
});
