import fs from "fs";
import path from "path";

import type { Node, Parent } from "unist";
import { u } from "unist-builder";
import { visit } from "unist-util-visit";

import { Index } from "../../__registry__/index.tsx";
import { defaultIconLibrary } from "../../registry/icons/icon-libraries.ts";
import { resolveIcons } from "../registry/resolve-icons.ts";

/**
 * Docs code blocks show the consumer form of registry files: icons
 * resolved to the default library, matching what the CLI installs. Main
 * also inlines `cn-*` style markers here; this branch authors its
 * sources with the nova style already inlined, so only icon resolution
 * remains.
 */
function toConsumerSource(source: string): string {
  return resolveIcons(source, defaultIconLibrary).code;
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
                  metastring: `title="${title}" showLineNumbers`,
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
                  metastring: "showLineNumbers",
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
