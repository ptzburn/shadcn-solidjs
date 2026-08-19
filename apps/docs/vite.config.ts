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
    // @kobalte/core@2.0.0-alpha.0 pins its solid-js and @solidjs/web peers to
    // exactly 2.0.0-rc.0, so Deno installs it a private rc.0 copy next to the
    // rc.1 the app uses. Two reactive runtimes would never share a context;
    // dedupe resolves every import of the Solid packages to the app's copy.
    dedupe: ["solid-js", "@solidjs/web", "@solidjs/signals"],
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
  plugins: [
    {
      ...mdxPlugin,
      enforce: "pre",
    },
    tailwindcss(),
    solid({
      // Client-only until Solid 2 RC's hydration-key divergence for
      // Dynamic children under Kobalte-style polymorphic components is
      // fixed upstream. Still reproduces on solid-js 2.0.0-rc.1: every
      // element child of a Kobalte button (its own, or any trigger built on
      // one) is emitted with a server hydration id three slots ahead of the
      // id the client computes, so the children are never claimed and the
      // miss cascades through the rest of the document. Enabling SSR also
      // needs `ssr.noExternal: true`, without which the server loads
      // Kobalte's pinned solid-js copy and hydration cannot align at all.
      // Flipping this back on is the whole revert (kobaltedev/kobalte#717).
      ssr: false,
      // Explicit so the module graph keys the root by its real casing: the
      // plugin's default probes `src/App.*` first, which macOS's
      // case-insensitive FS resolves to app.tsx, and edits to app.tsx then
      // never invalidate the entry the browser loaded (stale HMR).
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
  ],
});
