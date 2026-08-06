import deno from "@deno/vite-plugin";
import mdx from "@mdx-js/rollup";
import { solidStart } from "@solidjs/start/config";
import { nitro } from "nitro/vite";
import tailwindcss from "@tailwindcss/vite";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import Icons from "unplugin-icons/vite";
import { defineConfig, type Rollup } from "vite";

import rehypeComponent from "./src/lib/mdx/component.tsx";
import remarkSolidFrontmatter from "./src/lib/mdx/frontmatter.tsx";

const mdxPlugin = mdx({
  jsx: true,
  jsxImportSource: "solid-js",
  providerImportSource: "solid-mdx",
  remarkPlugins: [remarkGfm, remarkFrontmatter, remarkSolidFrontmatter],
  rehypePlugins: [rehypeSlug, rehypeComponent, [rehypePrettyCode, {
    theme: {
      dark: "github-dark",
      light: "github-light-default",
    },
    keepBackground: false,
  }]],
});

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: "node_modules/.vite",
  build: {
    target: "esnext",
  },
  plugins: [
    {
      ...mdxPlugin,
      enforce: "pre",
      // Skip ?raw imports so vite serves the untouched MDX source; the
      // docs middleware and Copy Page rely on it staying uncompiled.
      transform(code, id) {
        if (id.includes("?raw")) return;
        return (mdxPlugin.transform as (
          this: unknown,
          code: string,
          id: string,
        ) => Promise<Rollup.TransformResult>).call(this, code, id);
      },
    },
    tailwindcss(),
    solidStart({
      extensions: ["mdx", "md"],
      middleware: "./src/middleware.ts",
    }),
    nitro({
      preset: "deno_server",
      compatibilityDate: "2026-08-05",
    }),
    deno(),
    Icons({
      compiler: "solid",
      autoInstall: true,
    }),
    {
      // Workaround for @solidjs/start@2.0.0: its manifest plugin
      // reads the asset id from a query string in the resolved id, but Vite
      // strips the query before calling load. Returning the id verbatim from
      // resolveId keeps the query intact through to start's load hook.
      name: "solid-start-manifest-query-preserve",
      enforce: "pre",
      resolveId(id) {
        if (id.startsWith("/@manifest/")) return id;
      },
    },
  ],
});
