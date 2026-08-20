import { defineConfig, type UserConfig } from "tsdown";
import solid from "unplugin-solid/rolldown";

function generateConfig(jsx: boolean): UserConfig {
  return {
    target: "esnext",
    platform: "browser",
    format: ["esm"],
    clean: !jsx,
    dts: !jsx,
    entry: {
      "message-scroller/index": "src/message-scroller/index.ts",
    },
    outDir: "dist",
    treeshake: true,
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    outExtensions: () => (jsx ? { js: ".jsx" } : {}),
    inputOptions: jsx ? { transform: { jsx: "preserve" } } : undefined,
    plugins: jsx
      ? []
      : [solid({ solid: { generate: "dom", moduleName: "@solidjs/web" } })],
  };
}

export default defineConfig([generateConfig(false), generateConfig(true)]);
