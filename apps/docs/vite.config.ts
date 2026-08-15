import mdx from "@mdx-js/rollup";
import solid from "@solidjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { fileRoutes } from "filesystem-routing/vite";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";

import remarkSolidFrontmatter from "./src/lib/mdx/frontmatter.tsx";

const mdxPlugin = mdx({
  jsx: true,
  jsxImportSource: "@solidjs/web",
  // Local Solid 2 shim — solid-mdx itself is still compiled against Solid 1.
  providerImportSource: "~/lib/mdx/provider.tsx",
  remarkPlugins: [
    remarkGfm,
    remarkFrontmatter,
    remarkSolidFrontmatter,
  ],
  rehypePlugins: [
    rehypeSlug,
    [rehypePrettyCode, {
      theme: {
        dark: "vesper",
        light: "github-light-default",
      },
      keepBackground: false,
    }],
  ],
});

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: "node_modules/.vite",
  resolve: {
    alias: {
      // SolidStart used to provide this alias; the vite plugin does not.
      "~": new URL("./src", import.meta.url).pathname,
    },
  },
  build: {
    target: "esnext",
  },
  ssr: {
    // Kobalte's prebuilt dist is client-only (top-level template() calls);
    // bundling it lets the solid plugin compile the .jsx source for SSR.
    noExternal: ["@kobalte/core"],
  },
  plugins: [
    {
      ...mdxPlugin,
      enforce: "pre",
    },
    tailwindcss(),
    solid({
      ssr: true,
      start: true,
      extensions: [".mdx", ".md"],
    }),
    fileRoutes({
      extensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    }),
    Icons({
      compiler: "solid",
      autoInstall: true,
    }),
  ],
});
