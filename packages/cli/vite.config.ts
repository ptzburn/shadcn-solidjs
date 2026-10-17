import { defineConfig } from "vite-plus";

// Tests only: the CLI itself is built by tsdown.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
