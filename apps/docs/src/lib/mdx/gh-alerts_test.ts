import { assertEquals } from "@std/assert";
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

Deno.test("turns a GitHub alert with a bold first line into a titled Callout", () => {
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
  assertEquals(node.type, "mdxJsxFlowElement");
  assertEquals(node.name, "Callout");
  assertEquals(node.attributes, [
    { type: "mdxJsxAttribute", name: "variant", value: "warning" },
    { type: "mdxJsxAttribute", name: "title", value: "Server-side rendering" },
  ]);
  assertEquals(node.children.map((child) => child.type), ["paragraph"]);
});

Deno.test("maps NOTE to the default variant and keeps an untitled body", () => {
  const tree = parse(`> [!NOTE]
> Plain note.
`);
  const [node] = tree.children as unknown as Array<{
    name: string;
    attributes: Array<{ type: string; name: string; value: string }>;
  }>;
  assertEquals(node.name, "Callout");
  assertEquals(node.attributes, []);
});

Deno.test("leaves ordinary blockquotes alone", () => {
  const tree = parse(`> Just a quote.\n`);
  assertEquals(tree.children[0].type, "blockquote");
});
