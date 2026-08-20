// Returns the raw MDX source for a docs pathname like "/docs/components/button".
// Fetches the same .md pages that back the View as Markdown links (served by
// the docs-markdown-pages vite plugin), so the copied text always matches
// what the link opens. Main gets this from an import.meta.glob over the
// routes instead, but here the mdx plugin claims .mdx?raw imports before
// vite's raw handling and would hand back the compiled component.
export async function loadDocMarkdown(path: string) {
  const response = await fetch(`${path}.md`);
  if (!response.ok) return undefined;
  return await response.text();
}
