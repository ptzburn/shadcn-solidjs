import solid from "@solidjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { fileRoutes } from "filesystem-routing/vite";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "~": new URL("./src", import.meta.url).pathname,
    },
  },
  build: {
    target: "esnext",
  },
  plugins: [
    tailwindcss(),
    solid({
      ssr: true,
      start: true,
    }),
    fileRoutes(),
  ],
});
