import mdx from "@mdx-js/rollup";
import solid from "@solidjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { fileRoutes } from "filesystem-routing/vite";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import Icons from "unplugin-icons/vite";
import { defineConfig, lazyPlugins } from "vite-plus";

import rehypeComponent from "./src/lib/mdx/component.tsx";
import remarkSolidFrontmatter from "./src/lib/mdx/frontmatter.tsx";
import remarkGithubAlerts from "./src/lib/mdx/gh-alerts.ts";
import remarkNpmCommand from "./src/lib/mdx/npm-command.ts";
import rehypePrettyCodeSecondPass from "./src/lib/mdx/pretty-code.ts";
import { docsMarkdownPages } from "./src/lib/vite/docs-markdown-pages.ts";

export default defineConfig({
  resolve: {
    alias: {
      "~": new URL("./src", import.meta.url).pathname,
      "@ptzburn/shadcn-solid/message-scroller": new URL(
        "../../packages/solid/src/message-scroller/index.ts",
        import.meta.url,
      ).pathname,
    },
    dedupe: ["solid-js", "@solidjs/web", "@solidjs/signals"],
  },
  build: {
    target: "esnext",
  },
  preview: {
    allowedHosts: [".shadcn-solidjs.com"],
  },
  ssr: {
    noExternal: ["@kobalte/core"],
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  // Lazy so that fmt, lint and check never instantiate the plugins: the MDX
  // pipeline and the Solid plugin do real work at construction.
  plugins: lazyPlugins(() => {
    const mdxPlugin = mdx({
      jsx: true,
      jsxImportSource: "@solidjs/web",
      providerImportSource: "~/lib/mdx/provider.tsx",
      remarkPlugins: [
        remarkGfm,
        remarkFrontmatter,
        remarkSolidFrontmatter,
        remarkNpmCommand,
        remarkGithubAlerts,
      ],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypePrettyCode,
          {
            theme: {
              dark: "vesper",
              light: "github-light-default",
            },
            keepBackground: false,
          },
        ],
        rehypeComponent,
        [
          rehypePrettyCodeSecondPass,
          {
            theme: {
              dark: "github-dark",
              light: "github-light",
            },
            keepBackground: false,
          },
        ],
      ],
    });

    return [
      {
        ...mdxPlugin,
        enforce: "pre",
      },
      tailwindcss(),
      solid({
        ssr: false,
        start: { app: "src/app.tsx" },
        extensions: [".mdx", ".md"],
      }),
      fileRoutes({
        extensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
      }),
      Icons({
        compiler: "solid",
        autoInstall: true,
      }),
      docsMarkdownPages(),
    ];
  }),
});
