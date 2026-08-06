import rehypePrettyCode, { type Options } from "rehype-pretty-code";
import type { Node, Parent } from "unist";
import { visit } from "unist-util-visit";

interface ElementNode extends Node, Parent {
  tagName?: string;
  properties?: Record<string, unknown>;
}

/**
 * rehype-pretty-code processes any `pre > code`, including figures an
 * earlier pass already highlighted — re-running it would flatten their
 * spans back to plain text. Mask those pres while the inner transformer
 * runs so a second pass with different themes is safe.
 */
export default function rehypePrettyCodeSecondPass(options: Options) {
  const transformer = rehypePrettyCode(options) as (
    tree: Parent,
    file: unknown,
  ) => Promise<void> | void;

  return async function (tree: Parent, file: unknown) {
    const masked: ElementNode[] = [];
    visit(
      tree,
      "element",
      (node: ElementNode, _index, parent: ElementNode | undefined) => {
        if (
          node.tagName === "pre" &&
          parent?.tagName === "figure" &&
          parent.properties?.["data-rehype-pretty-code-figure"] !== undefined
        ) {
          node.tagName = "pre-highlighted";
          masked.push(node);
        }
      },
    );
    try {
      await transformer(tree, file);
    } finally {
      for (const node of masked) {
        node.tagName = "pre";
      }
    }
  };
}
