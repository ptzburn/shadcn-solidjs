import { promises as fs } from "node:fs";
import { join, normalize, relative, sep } from "node:path";
import mdx from "@mdx-js/rollup";
import solid from "@solidjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { fileRoutes } from "filesystem-routing/vite";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import Icons from "unplugin-icons/vite";
import type { Plugin } from "vite";
import { defineConfig } from "vite";

import rehypeComponent from "./src/lib/mdx/component.tsx";
import remarkSolidFrontmatter from "./src/lib/mdx/frontmatter.tsx";
import remarkNpmCommand from "./src/lib/mdx/npm-command.ts";
import rehypePrettyCodeSecondPass from "./src/lib/mdx/pretty-code.ts";

// @kobalte/core@2.0.0-alpha.1 ships the same dismissable layer as alpha.0,
// written against solid-js rc.0, where a signal write was visible to
// onSettled callbacks in the same flush. rc.1 through rc.5 give those
// callbacks committed visibility (solidjs/signals #3006), so the layer's
// settle-time registration reads its just-written ref as undefined and
// never joins the layer stack — dialogs and sheets then ignore Escape and
// outside clicks (measured again on rc.5 + alpha.1: without this transform
// neither dismisses, with it both do). Every consumer of that ref reads it
// imperatively, so a plain box restores the rc.0 behavior. Remove once a
// Kobalte release changes the line matched below.
function kobalteDismissableLayerFix(): Plugin {
  const broken =
    "const [ref, setRef] = createSignal(void 0, { ownedWrite: true });";
  const fixed =
    "let refBox; const ref = () => refBox; const setRef = (el) => { refBox = el; };";
  return {
    name: "kobalte-dismissable-layer-rc1-fix",
    enforce: "pre",
    transform(code, id) {
      if (!id.includes("@kobalte/core") || !id.includes("dismissable-layer")) {
        return;
      }
      if (!code.includes(broken)) return;
      return code.replace(broken, fixed);
    },
  };
}

// Serves /docs/<page>.md as the page's raw MDX source. Main answers these
// URLs from server middleware, but this build is a static client bundle:
// the dev server reads the routes tree on demand, and the build emits one
// .md asset per docs page so vite preview (or any static host) serves them.
function docsMarkdownPages(): Plugin {
  const routesDir = new URL("./src/routes/(app)/", import.meta.url).pathname;

  const sourceFor = async (pathname: string) => {
    const clean = normalize(pathname);
    if (!clean.startsWith("/docs/")) return undefined;
    for (const candidate of [`${clean}.mdx`, `${clean}/index.mdx`]) {
      try {
        return await fs.readFile(join(routesDir, candidate), "utf8");
      } catch {
        // fall through to the index candidate
      }
    }
    return undefined;
  };

  const collect = async (dir: string): Promise<string[]> => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const nested = await Promise.all(entries.map((entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) return collect(full);
      return Promise.resolve(entry.name.endsWith(".mdx") ? [full] : []);
    }));
    return nested.flat();
  };

  return {
    name: "docs-markdown-pages",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const match = req.url?.match(/^(\/docs\/[^?]+)\.md(\?.*)?$/);
        if (!match) return next();
        sourceFor(match[1]).then((source) => {
          if (source === undefined) return next();
          res.setHeader("content-type", "text/markdown; charset=utf-8");
          res.end(source);
        }, next);
      });
    },
    async generateBundle() {
      if (this.environment?.config.build.ssr) return;
      for (const file of await collect(join(routesDir, "docs"))) {
        const route = relative(routesDir, file)
          .split(sep).join("/")
          .replace(/\.mdx$/, "")
          .replace(/\/index$/, "");
        this.emitFile({
          type: "asset",
          fileName: `${route}.md`,
          source: await fs.readFile(file, "utf8"),
        });
      }
    },
  };
}

// The solid plugin bakes the client manifest into the shell bundle and,
// while doing so, unflags every chunk that some other chunk dynamically
// imports (lazy facades are emitted as entries). The registry index lazy-
// loads every ui component, and the site chrome imports a few of them
// statically, so Rollup folds those into the client entry and the registry's
// import() of them resolves to the entry chunk itself. The normalization then
// leaves no entry at all, the handler finds no client script to inject, and
// the prerendered shell is an empty document. Keep the real entry flagged by
// dropping it from every dynamicImports list before the shell build reads
// the manifest, and refuse to finish a build whose shell has no script.
function keepClientEntryInShell(): Plugin {
  const outDir = join(import.meta.dirname ?? ".", "dist/client");
  return {
    name: "docs-keep-client-entry-in-shell",
    apply: "build",
    async writeBundle() {
      if (this.environment.name !== "client") return;
      const file = join(outDir, ".vite/manifest.json");
      const manifest = JSON.parse(await fs.readFile(file, "utf8")) as Record<
        string,
        { isEntry?: boolean; dynamicImports?: string[] }
      >;
      const entries = Object.keys(manifest).filter((key) =>
        key.startsWith("virtual:solid-ssr-entry-client") &&
        manifest[key].isEntry
      );
      if (entries.length !== 1) {
        throw new Error(
          `expected one client entry in the manifest, found ${entries.length}`,
        );
      }
      for (const chunk of Object.values(manifest)) {
        chunk.dynamicImports = chunk.dynamicImports?.filter((key) =>
          key !== entries[0]
        );
      }
      await fs.writeFile(file, JSON.stringify(manifest, null, 2));
    },
    buildApp: {
      order: "post",
      async handler() {
        const shell = await fs.readFile(join(outDir, "index.html"), "utf8");
        if (!shell.includes('<script type="module"')) {
          throw new Error("prerendered shell has no client entry script");
        }
      },
    },
  };
}

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
      // The registry wrapper imports the published package specifier; docs
      // compile the engine straight from the workspace source.
      "@ptzburn/shadcn-solid/message-scroller": new URL(
        "../../packages/solid/src/message-scroller/index.ts",
        import.meta.url,
      ).pathname,
    },
    // @kobalte/core@2.0.0-alpha.1 pins its solid-js and @solidjs/web peers to
    // exactly 2.0.0-rc.3. Deno resolves the unsatisfied pin to the app's rc.5
    // copy with a warning (a fresh install links one copy), but a lockfile
    // can keep an older copy alive, as ours did through rc.4. Two reactive
    // runtimes would never share a context; dedupe pins every import of the
    // Solid packages to the app's copy so that can never happen.
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
      // Client-only until Solid's hydration-key divergence is fixed. It is
      // a Solid bug, not a Kobalte one: a lab route reproduced it
      // with no Kobalte in the tree, and isolated it to one combination —
      // a memo read *inside* a forwarded JSX prop expression, on a
      // component that resolves its tag through Dynamic. Neither half does
      // it alone. Same component with the reads hoisted to consts first
      // hydrates; the Dynamic wrapper with static props hydrates; the same
      // ternary reads on a plain <button> hydrate. With both, the server
      // emits the trigger's element children two id slots ahead of the ids
      // the client computes, so they are never claimed. Kobalte's
      // ButtonRoot is exactly that shape (five ternaries over memos
      // forwarded into Polymorphic), which is why every trigger is hit.
      // rc.2 shipped a fix for a neighbouring case (#3033, id parity for a
      // conditional in a forwarded prop) and rc.5 another (#3105, ids after
      // a reactive lone spread); neither covers this one. Re-verified
      // unchanged on rc.3, rc.4 and rc.5: same four misses, same two-slot
      // gap, and Progress and Tabs still halt hydration outright.
      // Enabling SSR also needs `ssr.noExternal: true`, without which the
      // server loads Kobalte's pinned solid-js copy and hydration cannot
      // align at all. Flipping this back on is the whole revert.
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
    docsMarkdownPages(),
    kobalteDismissableLayerFix(),
    keepClientEntryInShell(),
  ],
});
