import type { Blockquote, Root } from "mdast";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";

const ALERT = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/;

const VARIANTS: Record<string, string | undefined> = {
  NOTE: undefined,
  TIP: "info",
  IMPORTANT: "info",
  WARNING: "warning",
  CAUTION: "warning",
};

type Attribute = { type: "mdxJsxAttribute"; name: string; value: string };

/**
 * Renders GitHub alert blockquotes (`> [!NOTE]`, `> [!WARNING]`, ...) with
 * the Callout component. A bold-only first line becomes the title, which is
 * also how the Markdown export writes callouts back out.
 */
export default function remarkGithubAlerts() {
  return function (tree: Root) {
    visit(tree, "blockquote", (node: Blockquote, index, parent) => {
      const [first] = node.children;
      if (!parent || index === undefined || first?.type !== "paragraph") {
        return;
      }
      const [lead] = first.children;
      if (lead?.type !== "text") return;
      const match = ALERT.exec(lead.value);
      if (!match) return;

      lead.value = lead.value.slice(match[0].length);
      if (!lead.value) first.children.shift();

      const attributes: Attribute[] = [];
      const variant = VARIANTS[match[1]];
      if (variant) {
        attributes.push({
          type: "mdxJsxAttribute",
          name: "variant",
          value: variant,
        });
      }
      const body = node.children.slice(1);
      const [only] = first.children;
      if (first.children.length === 1 && only.type === "strong") {
        attributes.push({
          type: "mdxJsxAttribute",
          name: "title",
          value: toString(only),
        });
      } else if (first.children.length > 0) {
        body.unshift(first);
      }

      parent.children[index] = {
        type: "mdxJsxFlowElement",
        name: "Callout",
        attributes,
        children: body,
      } as unknown as Blockquote;
    });
  };
}
