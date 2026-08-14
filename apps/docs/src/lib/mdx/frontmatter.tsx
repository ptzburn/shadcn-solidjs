import { valueToEstree } from "estree-util-value-to-estree";
import type { Literal, Parent } from "unist";
import { parse } from "yaml";

export type Frontmatter = {
  title: string;
  description: string;
};

export default function remarkSolidFrontmatter() {
  return function (tree: Parent) {
    const index = tree.children.findIndex((node) => node.type === "yaml");
    if (index === -1) {
      return;
    }
    const node = tree.children[index] as Literal;
    const data = parse(node.value as string) as Frontmatter;

    // Render the page header from frontmatter, like the upstream docs page
    // does with fumadocs page data.
    const header = {
      type: "mdxJsxFlowElement",
      name: "MDXHeader",
      attributes: Object.entries(data)
        .filter(([, value]) => typeof value === "string")
        .map(([name, value]) => ({
          type: "mdxJsxAttribute",
          name,
          value,
        })),
      children: [],
    } as unknown as Parent["children"][number];
    tree.children.splice(index + 1, 0, header);

    tree.children.unshift({
      type: "mdxjsEsm",
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [
            {
              type: "ExportNamedDeclaration",
              specifiers: [],
              declaration: {
                type: "VariableDeclaration",
                kind: "const",
                declarations: Object.entries({
                  frontmatter: data,
                }).map(([identifier, value]) => ({
                  type: "VariableDeclarator",
                  id: {
                    type: "Identifier",
                    name: identifier,
                  },
                  init: valueToEstree(value),
                })),
              },
            },
          ],
        },
      },
    });
  };
}
