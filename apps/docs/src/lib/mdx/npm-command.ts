import type { Node, Parent } from "unist";
import { visit } from "unist-util-visit";

interface CodeNode extends Node {
  lang?: string;
  value: string;
}

type CommandVariants = {
  npm: string;
  yarn: string;
  pnpm: string;
  bun: string;
  deno: string;
};

/** deno add needs the npm: prefix on every package, but not on flags. */
function denoAdd(command: string): string {
  const args = command.replace("npm install", "").trim();
  if (!args) return "deno install";
  const mapped = args
    .split(/\s+/)
    .map((token) => (token.startsWith("-") ? token : `npm:${token}`));
  return `deno add ${mapped.join(" ")}`;
}

/**
 * Port of the upstream package manager derivation (lib/highlight-code.ts
 * transformers), plus branches upstream never encounters: npm init x is
 * npm create x, and deno commands are derived per shape.
 */
function packageManagerVariants(command: string): CommandVariants | undefined {
  if (command.startsWith("npm install")) {
    return {
      npm: command,
      yarn: command.replace("npm install", "yarn add"),
      pnpm: command.replace("npm install", "pnpm add"),
      bun: command.replace("npm install", "bun add"),
      deno: denoAdd(command),
    };
  }
  if (command.startsWith("npx create-")) {
    return {
      npm: command,
      yarn: command.replace("npx create-", "yarn create "),
      pnpm: command.replace("npx create-", "pnpm create "),
      bun: command.replace("npx", "bunx --bun"),
      deno: command.replace("npx create-", "deno run -A npm:create-"),
    };
  }
  if (command.startsWith("npm create") || command.startsWith("npm init")) {
    const create = command.replace("npm init", "npm create");
    return {
      npm: command,
      yarn: create.replace("npm create", "yarn create"),
      pnpm: create.replace("npm create", "pnpm create"),
      bun: create.replace("npm create", "bun create"),
      deno: create.replace("npm create ", "deno run -A npm:create-"),
    };
  }
  if (command.startsWith("npx")) {
    return {
      npm: command,
      yarn: command.replace("npx", "yarn dlx"),
      pnpm: command.replace("npx", "pnpm dlx"),
      bun: command.replace("npx", "bunx --bun"),
      deno: command.replace("npx ", "deno run -A npm:"),
    };
  }
  if (command.startsWith("npm run")) {
    return {
      npm: command,
      yarn: command.replace("npm run", "yarn"),
      pnpm: command.replace("npm run", "pnpm"),
      bun: command.replace("npm run", "bun"),
      deno: command.replace("npm run", "deno task"),
    };
  }
  return undefined;
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
        const variants = packageManagerVariants(command);
        if (!variants) {
          return;
        }
        parent.children[index] = {
          type: "mdxJsxFlowElement",
          name: "CodeBlockCommand",
          attributes: Object.entries(variants).map(([name, value]) => ({
            type: "mdxJsxAttribute",
            name,
            value,
          })),
          children: [],
        } as unknown as Node;
      },
    );
  };
}
