import { defineConfig } from "vite-plus";

// Tests only: the package itself is built by tsdown. The geometry tests
// bring their own JSDOM, so the node environment is enough.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
