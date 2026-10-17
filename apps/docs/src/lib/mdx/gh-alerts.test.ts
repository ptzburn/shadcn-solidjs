import { expect, test } from "vite-plus/test";
import type { Root } from "mdast";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import remarkGithubAlerts from "./gh-alerts.ts";

function parse(source: string): Root {
  const processor = unified().use(remarkParse).use(remarkMdx).use(
    remarkGithubAlerts,
  );
  return processor.runSync(processor.parse(source)) as Root;
}

test("turns a GitHub alert with a bold first line into a titled Callout", () => {
  const tree = parse(`> [!WARNING]
> **Server-side rendering**
>
> Stay client-rendered for now.
`);
  const [node] = tree.children as unknown as Array<{
    type: string;
    name: string;
    attributes: Array<{ type: string; name: string; value: string }>;
    children: Array<{ type: string }>;
  }>;
  expect(node.type).toEqual("mdxJsxFlowElement");
  expect(node.name).toEqual("Callout");
  expect(node.attributes).toEqual([
    { type: "mdxJsxAttribute", name: "variant", value: "warning" },
    { type: "mdxJsxAttribute", name: "title", value: "Server-side rendering" },
  ]);
  expect(node.children.map((child) => child.type)).toEqual(["paragraph"]);
});

test("maps NOTE to the default variant and keeps an untitled body", () => {
  const tree = parse(`> [!NOTE]
> Plain note.
`);
  const [node] = tree.children as unknown as Array<{
    name: string;
    attributes: Array<{ type: string; name: string; value: string }>;
  }>;
  expect(node.name).toEqual("Callout");
  expect(node.attributes).toEqual([]);
});

test("leaves ordinary blockquotes alone", () => {
  const tree = parse(`> Just a quote.\n`);
  expect(tree.children[0].type).toEqual("blockquote");
});
