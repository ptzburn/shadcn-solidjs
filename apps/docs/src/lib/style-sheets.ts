/**
 * Built URL of each style's stylesheet (styles/style/<name>.css).
 *
 * Loading all eight styles at once made every element match roughly 13,500
 * rules, and that style pass dominated each client-side navigation. Only the
 * active style's sheet is in the document: Document.tsx renders it for the
 * default style, StyleScript repoints it before first paint, and the style
 * provider swaps it when the visitor picks another.
 */
import type { StyleName } from "~/registry/styles.ts";

import luma from "~/styles/style/luma.css?url";
import lyra from "~/styles/style/lyra.css?url";
import maia from "~/styles/style/maia.css?url";
import mira from "~/styles/style/mira.css?url";
import nova from "~/styles/style/nova.css?url";
import rhea from "~/styles/style/rhea.css?url";
import sera from "~/styles/style/sera.css?url";
import vega from "~/styles/style/vega.css?url";

export const styleSheets: Record<StyleName, string> = {
  nova,
  vega,
  maia,
  lyra,
  mira,
  luma,
  sera,
  rhea,
};

/** The `<link>` that carries the active style's sheet. */
export const STYLE_SHEET_ID = "style-sheet";
