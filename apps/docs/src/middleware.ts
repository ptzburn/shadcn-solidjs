import { createMiddleware } from "@solidjs/start/middleware";

import { loadDocMarkdown } from "~/lib/docs-raw.ts";

export default createMiddleware({
  onRequest: async (event) => {
    const url = new URL(event.request.url);
    const match = url.pathname.match(/^(\/docs\/.+)\.md$/);
    if (!match) return;

    const loader = loadDocMarkdown(match[1]);
    if (!loader) return;

    return new Response(await loader, {
      headers: { "content-type": "text/markdown; charset=utf-8" },
    });
  },
});
