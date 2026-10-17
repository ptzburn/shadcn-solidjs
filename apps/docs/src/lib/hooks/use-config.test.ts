import { expect, test } from "vite-plus/test";
import { sanitizeConfig } from "./use-config.ts";

test("a saved deno package manager falls back to the default", () => {
  expect(sanitizeConfig({ packageManager: "deno" }).packageManager).toBe("pnpm");
});

test("a known package manager is kept", () => {
  expect(sanitizeConfig({ packageManager: "bun" }).packageManager).toBe("bun");
});
