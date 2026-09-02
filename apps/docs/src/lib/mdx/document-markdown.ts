import type {
  Blockquote,
  Code,
  Heading,
  Paragraph,
  PhrasingContent,
  Root,
  RootContent,
} from "mdast";
import { toString } from "mdast-util-to-string";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { parse as parseYaml } from "yaml";

export type DocumentMarkdownOptions = {
  /** Source of a registry item by name, for previews and component sources. */
  resolve?: (name: string) => string | undefined;
};

type Frontmatter = { title?: string; description?: string };

type JsxAttribute = { type: string; name?: string; value?: unknown };

type JsxElement = {
  type: "mdxJsxFlowElement" | "mdxJsxTextElement";
  name: string | null;
  attributes: JsxAttribute[];
  children: RootContent[];
};

type Node = RootContent & { children?: RootContent[] };

const CALLOUT_ALERTS: Record<string, string> = {
  default: "NOTE",
  info: "TIP",
  warning: "WARNING",
};

function isJsx(node: Node): node is Node & JsxElement {
  return node.type === "mdxJsxFlowElement" ||
    node.type === "mdxJsxTextElement";
}

function attributesOf(node: JsxElement): Record<string, string> {
  const attributes: Record<string, string> = {};
  for (const attribute of node.attributes) {
    if (
      attribute.type === "mdxJsxAttribute" && attribute.name &&
      typeof attribute.value === "string"
    ) {
      attributes[attribute.name] = attribute.value;
    }
  }
  return attributes;
}

function text(value: string): PhrasingContent {
  return { type: "text", value };
}

function heading(
  depth: Heading["depth"],
  children: PhrasingContent[],
): Heading {
  return { type: "heading", depth, children };
}

function paragraph(children: PhrasingContent[]): Paragraph {
  return { type: "paragraph", children };
}

function code(lang: string, value: string): Code {
  return { type: "code", lang, value: value.trimEnd() };
}

/** Inline content of an element, unwrapping the paragraphs MDX adds. */
function phrasingOf(nodes: RootContent[]): PhrasingContent[] {
  return nodes.flatMap((node): PhrasingContent[] => {
    if (node.type === "paragraph") return node.children;
    if (isJsx(node)) return phrasingOf(node.children);
    return [node as PhrasingContent];
  });
}

function frontmatterNodes(value: string): RootContent[] {
  const data = parseYaml(value) as Frontmatter | null;
  const nodes: RootContent[] = [];
  if (data?.title) nodes.push(heading(1, [text(data.title)]));
  if (data?.description) nodes.push(paragraph([text(data.description)]));
  return nodes;
}

function callout(node: JsxElement, body: RootContent[]): Blockquote {
  const attributes = attributesOf(node);
  const alert = CALLOUT_ALERTS[attributes.variant ?? "default"] ??
    CALLOUT_ALERTS.default;
  const children: Blockquote["children"] = [
    paragraph([{ type: "html", value: `[!${alert}]` }]),
  ];
  if (attributes.title) {
    children.push(
      paragraph([{ type: "strong", children: [text(attributes.title)] }]),
    );
  }
  return {
    type: "blockquote",
    children: [...children, ...body] as Blockquote["children"],
  };
}

/** Elements by name at any depth: MDX wraps inline JSX in paragraphs. */
function findJsx(nodes: RootContent[], name: string): JsxElement[] {
  return (nodes as Node[]).flatMap((node) => {
    if (isJsx(node) && node.name === name) return [node];
    return node.children ? findJsx(node.children, name) : [];
  });
}

function codeTabs(
  node: JsxElement,
  transform: (nodes: RootContent[]) => RootContent[],
): RootContent[] {
  const labels: Record<string, string> = {};
  for (const trigger of findJsx(node.children, "TabsTrigger")) {
    labels[attributesOf(trigger).value ?? ""] = toString(trigger).trim();
  }
  return findJsx(node.children, "TabsContent").flatMap((content) => {
    const value = attributesOf(content).value ?? "";
    return [
      heading(3, [text(labels[value] || value)]),
      ...transform(content.children),
    ];
  });
}

function rewriteJsx(
  node: JsxElement,
  options: DocumentMarkdownOptions,
  transform: (nodes: RootContent[]) => RootContent[],
): RootContent[] {
  const attributes = attributesOf(node);
  switch (node.name) {
    case "ComponentPreview":
    case "ComponentSource": {
      const source = attributes.name
        ? options.resolve?.(attributes.name)
        : undefined;
      return source ? [code("tsx", source)] : [];
    }
    case "CodeTabs":
    case "Tabs":
      return codeTabs(node, transform);
    case "TabsList":
    case "TabsTrigger":
      return [];
    case "Step":
    case "AccordionTrigger":
      return [heading(4, phrasingOf(transform(node.children)))];
    case "Callout":
      return [callout(node, transform(node.children))];
    case "LinkedCard": {
      const label = toString(node).replace(/\s+/g, " ").trim();
      return [paragraph([{
        type: "link",
        url: attributes.href ?? "",
        children: [text(label)],
      }])];
    }
    default:
      return transform(node.children);
  }
}

function remarkDocument(options: DocumentMarkdownOptions) {
  const transform = (nodes: RootContent[]): RootContent[] =>
    (nodes as Node[]).flatMap((node): RootContent[] => {
      if (node.type === "yaml") return frontmatterNodes(node.value);
      if (
        node.type === "mdxjsEsm" || node.type === "mdxFlowExpression" ||
        node.type === "mdxTextExpression"
      ) {
        return [];
      }
      if (isJsx(node)) return rewriteJsx(node, options, transform);
      if (node.children) node.children = transform(node.children);
      return [node];
    });
  return function (tree: Root) {
    tree.children = transform(tree.children);
  };
}

/**
 * Renders a docs page's MDX source as plain Markdown for readers and
 * models: the page header from frontmatter, no imports, and the JSX
 * components the site renders replaced by their Markdown equivalents.
 */
export function toDocumentMarkdown(
  source: string,
  options: DocumentMarkdownOptions = {},
): string {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkDocument, options)
    .use(remarkStringify, { bullet: "-", fences: true, rule: "-" });
  return String(processor.processSync(source));
}
