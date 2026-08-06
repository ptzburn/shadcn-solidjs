import type { Node, Parent } from "unist";
import { visit } from "unist-util-visit";

interface CodeNode extends Node {
  lang?: string;
  value: string;
}

/**
 * Replaces single-line npm/npx bash fences with a <CodeBlockCommand>
 * element (see src/components/code-block-command.tsx), the port of the
 * upstream shadcn command block. Runs before rehype-pretty-code ever
 * sees the fence, so commands render as plain text like upstream.
 */
export default function remarkNpmCommand() {
  return function (tree: Node) {
    visit(
      tree,
      "code",
      (
        node: CodeNode,
        index: number | undefined,
        parent: Parent | undefined,
      ) => {
        if (!parent || index === undefined || node.lang !== "bash") {
          return;
        }
        const command = node.value.trim();
        if (!/^(npm|npx)\s[^\n]*$/.test(command)) {
          return;
        }
        parent.children[index] = {
          type: "mdxJsxFlowElement",
          name: "CodeBlockCommand",
          attributes: [
            { type: "mdxJsxAttribute", name: "npm", value: command },
          ],
          children: [],
        } as unknown as Node;
      },
    );
  };
}
