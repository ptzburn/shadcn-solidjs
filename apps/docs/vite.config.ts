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

import rehypeComponent from "./src/lib/mdx/component.tsx";
import remarkSolidFrontmatter from "./src/lib/mdx/frontmatter.tsx";
import remarkNpmCommand from "./src/lib/mdx/npm-command.ts";
import rehypePrettyCodeSecondPass from "./src/lib/mdx/pretty-code.ts";
import { solidjsSignalsOmitFix } from "./src/lib/vite/solidjs-signals-omit-fix.ts";

const mdxPlugin = mdx({
  jsx: true,
  jsxImportSource: "@solidjs/web",
  // Local Solid 2 shim — solid-mdx itself is still compiled against Solid 1.
  providerImportSource: "~/lib/mdx/provider.tsx",
  remarkPlugins: [
    remarkGfm,
    remarkFrontmatter,
    remarkSolidFrontmatter,
    remarkNpmCommand,
  ],
  // Two highlighting passes like main: authored fences use the docs
  // themes, while the registry sources rehypeComponent injects afterwards
  // keep the github themes.
  rehypePlugins: [
    rehypeSlug,
    [rehypePrettyCode, {
      theme: {
        dark: "vesper",
        light: "github-light-default",
      },
      keepBackground: false,
    }],
    rehypeComponent,
    [rehypePrettyCodeSecondPass, {
      theme: {
        dark: "github-dark",
        light: "github-light",
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
  preview: {
    // vite preview 403s Host headers it does not recognize; the leading
    // dot covers the apex domain and any subdomain (v2., www., ...).
    allowedHosts: [".shadcn-solidjs.com"],
  },
  ssr: {
    // Kobalte's prebuilt dist is client-only (top-level template() calls);
    // bundling it lets the solid plugin compile the .jsx source for SSR.
    noExternal: ["@kobalte/core"],
  },
  optimizeDeps: {
    // The dev prebundle bypasses regular plugin transforms, so the omit fix
    // must also run inside the dep optimizer.
    rolldownOptions: {
      plugins: [solidjsSignalsOmitFix()],
    },
  },
  plugins: [
    solidjsSignalsOmitFix(),
    {
      ...mdxPlugin,
      enforce: "pre",
    },
    tailwindcss(),
    solid({
      // Client-only until Solid 2 RC's hydration-key divergence for
      // Dynamic children under Kobalte-style polymorphic components is
      // fixed upstream; flipping this back on is the whole revert.
      ssr: false,
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
