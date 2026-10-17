import { promises as fs, readFileSync } from "node:fs";
import { join, normalize, relative, sep } from "node:path";
import type { Plugin } from "vite";

import { Meta as Index } from "../../__registry__/meta.ts";
import { toConsumerSource } from "../mdx/component.tsx";
import { toDocumentMarkdown } from "../mdx/document-markdown.ts";
import { orderDocPages } from "../mdx/llms.ts";

const srcDir = new URL("../../", import.meta.url).pathname;
const routesDir = join(srcDir, "routes/(app)/");
const llmsIndex = new URL("../../../public/llms.txt", import.meta.url).pathname;

// Anything the converter should have rewritten. A page that still carries
// one of these would reach readers as raw JSX, so the build refuses it.
const LEFTOVER_JSX =
  /<(ComponentPreview|ComponentSource|CodeTabs|Steps|Callout)\b/;

/** Registry item source as the CLI installs it, for previews and sources. */
function resolveRegistrySource(name: string): string | undefined {
  const item = Index[name];
  if (!item) return undefined;
  return toConsumerSource(
    readFileSync(join(srcDir, item.files[0].path), "utf8"),
  );
}

async function render(file: string): Promise<string> {
  const markdown = toDocumentMarkdown(await fs.readFile(file, "utf8"), {
    resolve: resolveRegistrySource,
  });
  const leftover = LEFTOVER_JSX.exec(markdown);
  if (leftover) {
    throw new Error(`${file}: ${leftover[0]} survived the Markdown export`);
  }
  return markdown;
}

async function collect(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return collect(full);
    return Promise.resolve(entry.name.endsWith(".mdx") ? [full] : []);
  }));
  return nested.flat();
}

/** "/docs/components/button" for the page file at that route. */
function routeOf(file: string): string {
  return "/" + relative(routesDir, file)
    .split(sep).join("/")
    .replace(/\.mdx$/, "")
    .replace(/\/index$/, "");
}

async function pageFor(pathname: string): Promise<string | undefined> {
  const clean = normalize(pathname);
  if (!clean.startsWith("/docs/")) return undefined;
  for (const candidate of [`${clean}.mdx`, `${clean}/index.mdx`]) {
    const file = join(routesDir, candidate);
    try {
      await fs.access(file);
      return file;
    } catch {
      // try the index candidate
    }
  }
  return undefined;
}

async function fullText(): Promise<string> {
  const files = await collect(join(routesDir, "docs"));
  const byRoute = new Map(files.map((file) => [routeOf(file), file]));
  const order = orderDocPages(
    await fs.readFile(llmsIndex, "utf8"),
    [...byRoute.keys()],
  );
  const documents: string[] = [];
  for (const route of order) documents.push(await render(byRoute.get(route)!));
  return documents.join("\n\n---\n\n");
}

/**
 * Serves every docs page as Markdown at /docs/<page>.md and all of them
 * together at /llms-full.txt, in the order public/llms.txt lists them.
 * The dev server renders on demand; the build emits one asset per page.
 */
export function docsMarkdownPages(): Plugin {
  return {
    name: "docs-markdown-pages",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split("?")[0] ?? "";
        const page = url === "/llms-full.txt"
          ? Promise.resolve(fullText())
          : url.endsWith(".md")
          ? pageFor(url.slice(0, -3)).then((file) => file && render(file))
          : Promise.resolve(undefined);
        page.then((body) => {
          if (body === undefined) return next();
          res.setHeader("content-type", "text/markdown; charset=utf-8");
          res.end(body);
        }, next);
      });
    },
    async generateBundle() {
      if (this.environment?.config.build.ssr) return;
      for (const file of await collect(join(routesDir, "docs"))) {
        this.emitFile({
          type: "asset",
          fileName: `${routeOf(file).slice(1)}.md`,
          source: await render(file),
        });
      }
      this.emitFile({
        type: "asset",
        fileName: "llms-full.txt",
        source: await fullText(),
      });
    },
  };
}
