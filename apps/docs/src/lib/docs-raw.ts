const modules = import.meta.glob("../routes/**/*.mdx", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

const docs = new Map<string, () => Promise<string>>();
for (const [key, loader] of Object.entries(modules)) {
  const path = key.match(/(\/docs\/.+)\.mdx$/)?.[1];
  if (path) docs.set(path, loader);
}

// Returns the raw MDX source for a docs pathname like "/docs/components/button".
export function loadDocMarkdown(path: string) {
  return docs.get(path)?.();
}
