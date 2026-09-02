import { assertEquals } from "@std/assert";
import { toDocumentMarkdown } from "./document-markdown.ts";

Deno.test("renders frontmatter as the title and description, drops imports", () => {
  const source = `---
title: Button
description: Displays a button.
---

import { Button } from "~/components/ui/button"

Some **prose** here.
`;
  assertEquals(
    toDocumentMarkdown(source),
    `# Button

Displays a button.

Some **prose** here.
`,
  );
});

const resolve = (name: string) =>
  name === "button-demo"
    ? "export default () => <button>Hi</button>;\n"
    : undefined;

Deno.test("expands previews and sources into tsx fences, drops unknown ones", () => {
  const source =
    `<ComponentPreview name="button-demo" previewClassName="h-auto" />

<ComponentSource name="missing" />
`;
  assertEquals(
    toDocumentMarkdown(source, { resolve }),
    "```tsx\nexport default () => <button>Hi</button>;\n```\n",
  );
});

Deno.test("turns code tabs into one section per tab", () => {
  const source = `<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>

<TabsContent value="cli">

\`\`\`bash
npx add button
\`\`\`

</TabsContent>

<TabsContent value="manual">

Copy the file.

</TabsContent>

</CodeTabs>
`;
  assertEquals(
    toDocumentMarkdown(source),
    "### Command\n\n```bash\nnpx add button\n```\n\n### Manual\n\nCopy the file.\n",
  );
});

Deno.test("turns steps into level-four headings", () => {
  const source = `<Steps class="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

\`\`\`bash
npm install clsx
\`\`\`

</Steps>
`;
  assertEquals(
    toDocumentMarkdown(source),
    "#### Install the following dependencies:\n\n```bash\nnpm install clsx\n```\n",
  );
});

Deno.test("turns callouts into GitHub alerts with the title in bold", () => {
  const source = `<Callout variant="warning" title="Server-side rendering">
  Stay client-rendered for now.
</Callout>

<Callout>
  Plain note.
</Callout>
`;
  assertEquals(
    toDocumentMarkdown(source),
    `> [!WARNING]
>
> **Server-side rendering**
>
> Stay client-rendered for now.

> [!NOTE]
>
> Plain note.
`,
  );
});

Deno.test("flattens other elements to their children and drops expressions", () => {
  const source = `<div class="grid">
  <LinkedCard href="/docs/installation/solid">
    <svg role="img"><path d="M0" /></svg>
    <p class="mt-2">Solid</p>
  </LinkedCard>
</div>

{/* a comment */}

Done.
`;
  assertEquals(
    toDocumentMarkdown(source),
    "[Solid](/docs/installation/solid)\n\nDone.\n",
  );
});
