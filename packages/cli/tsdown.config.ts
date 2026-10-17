import { defineConfig } from "tsdown";

// One ESM bundle for the `shadcn-solidjs` bin. Runtime dependencies stay
// external (tsdown's default for `dependencies`), the shebang at the top of
// src/index.ts is kept, and no declarations are emitted: the bin is run,
// never imported.
export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm"],
  platform: "node",
  target: "es2022",
  dts: false,
  clean: true,
  // package.json is already ESM-typed, so the bin keeps the plain .js name
  // that `bin` points at instead of tsdown's .mjs.
  fixedExtension: false,
});
