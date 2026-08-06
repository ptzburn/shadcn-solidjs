import fs from "fs";
import path from "path";

import type { Node, Parent } from "unist";
import { u } from "unist-builder";
import { visit } from "unist-util-visit";

import { Index } from "../../__registry__/index.tsx";
import { resolveIcons } from "../registry/resolve-icons.ts";
import { createStyleMap, inlineStyles } from "../registry/style-map.ts";
import { defaultIconLibrary } from "../../registry/icons/icon-libraries.ts";

const styleMap = createStyleMap(
  fs.readFileSync(
    path.join(process.cwd(), "src/registry/styles/style-nova.css"),
    "utf-8",
  ),
);

/**
 * Docs code blocks show the consumer form of registry files: style
 * markers inlined and icons resolved, matching what the CLI installs.
 */
function toConsumerSource(source: string): string {
  return resolveIcons(inlineStyles(source, styleMap), defaultIconLibrary).code;
}

interface ComponentNode extends Node, Parent {
  name?: string;
  attributes?: {
    name: string;
    value: unknown;
    type?: string;
  }[];
}

export default function rehypeComponent() {
  return function (tree: ComponentNode) {
    visit(tree, (node) => {
      if (!("name" in node)) {
        return null;
      }

      if (node.name === "ComponentSource") {
        const name = getNodeAttributeByName(node, "name")?.value as string;
        if (!name) {
          return null;
        }

        const component = Index[name];
        if (!component) {
          return null;
        }

        const filePath = path.join(
          process.cwd(),
          "src",
          component.files[0].path,
        );
        let source = toConsumerSource(fs.readFileSync(filePath, "utf-8"));

        source = source.replaceAll("~/registry/", "~/components/");
        source = source.replaceAll("export default", "export");

        // The consumer path doubles as the code block title, like the
        // upstream title="components/ui/…" on every ComponentSource.
        const title = component.files[0].path.replace(
          /^registry\//,
          "components/",
        );

        node.children?.push(
          u("element", {
            tagName: "pre",
            properties: {},
            children: [
              u("element", {
                tagName: "code",
                properties: {
                  className: ["language-tsx"],
                  metastring: `title="${title}"`,
                },
                children: [
                  {
                    type: "text",
                    value: source,
                  },
                ],
              }),
            ],
          }),
        );
      }

      if (node.name === "ComponentPreview") {
        const name = getNodeAttributeByName(node, "name")?.value as string;
        if (!name) {
          return null;
        }

        const component = Index[name];
        if (!component) {
          return null;
        }

        const filePath = path.join(
          process.cwd(),
          "src",
          component.files[0].path,
        );
        let source = toConsumerSource(fs.readFileSync(filePath, "utf-8"));

        source = source.replaceAll("~/registry/", "~/components/");
        source = source.replaceAll("export default", "export");

        node.children?.push(
          u("element", {
            tagName: "pre",
            properties: {},
            children: [
              u("element", {
                tagName: "code",
                properties: {
                  className: ["language-tsx"],
                },
                children: [
                  {
                    type: "text",
                    value: source,
                  },
                ],
              }),
            ],
          }),
        );
      }
    });
  };
}

const getNodeAttributeByName = (node: ComponentNode, name: string) => {
  return node.attributes?.find((attribute) => attribute.name === name);
};
