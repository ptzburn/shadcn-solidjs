import { ColorModeScript } from "@kobalte/core/color-mode";
import { HydrationScript, type JSX } from "@solidjs/web";
import { BaseColorScript } from "~/lib/base-color-context.tsx";
import { StyleScript } from "~/lib/style-context.tsx";
import { STYLE_SHEET_ID, styleSheets } from "~/lib/style-sheets.ts";
import { defaultStyle } from "~/registry/styles.ts";

export default function Document(props: { children: JSX.Element }) {
  return (
    <html lang="en" class="style-nova">
      <head>
        {/* Static rather than @solidjs/meta: neither changes per page, and
            the viewport must be right from the first paint or mobile renders
            a zoomed-out desktop layout. */}
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Inline scripts only run when they arrive as HTML: rendered from the
            client bundle, Solid builds them through a template clone, which
            the browser never executes. The shell is server-rendered, so the
            stored mode is applied before first paint from here. */}
        <ColorModeScript storageType="cookie" />
        {/* The active style's sheet. StyleScript, right after it, repoints it
            at the stored style; `blocking` keeps the first paint waiting for
            the repointed sheet as well. */}
        <link
          id={STYLE_SHEET_ID}
          rel="stylesheet"
          href={styleSheets[defaultStyle]}
          blocking="render"
        />
        <StyleScript />
        <BaseColorScript />
        <HydrationScript />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
