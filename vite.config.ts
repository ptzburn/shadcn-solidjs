import { defineConfig } from "vite-plus";

// Workspace-wide Vite+ settings: Oxfmt, Oxlint with the type check, and the
// Vitest projects. Each member keeps its own vite.config.ts for Vite itself
// and for its test environment.
//
// The generated registry under apps/docs/public is written by the registry
// build scripts, formatted as JSON by JSON.stringify, and never hand-edited.
const generated = ["apps/docs/public/r/**", "apps/docs/public/registry/**"];

export default defineConfig({
  fmt: {
    ignorePatterns: generated,
  },
  lint: {
    plugins: ["typescript"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    ignorePatterns: generated,
  },
  test: {
    projects: ["apps/*", "packages/*"],
  },
});
