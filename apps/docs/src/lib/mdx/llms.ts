const DOC_LINK = /\]\(https?:\/\/[^)]*?(\/docs\/[^)#?]+?)(?:\.md)?\)/g;

/**
 * Docs pages in the order the llms.txt index lists them, followed by any
 * page the index leaves out, so llms-full.txt reads in the curated order.
 */
export function orderDocPages(index: string, pages: string[]): string[] {
  const listed = [...index.matchAll(DOC_LINK)].map((match) => match[1]);
  const known = new Set(pages);
  const ordered = [...new Set(listed)].filter((page) => known.has(page));
  const rest = pages.filter((page) => !ordered.includes(page)).sort();
  return [...ordered, ...rest];
}
