import { expect, test } from "vite-plus/test";
import { toDocumentMarkdown } from "./document-markdown.ts";

test("renders frontmatter as the title and description, drops imports", () => {
  const source = `---
title: Button
description: Displays a button.
---

import { Button } from "~/components/ui/button"

Some **prose** here.
`;
  expect(toDocumentMarkdown(source)).toEqual(`# Button

Displays a button.

Some **prose** here.
`);
});

const resolve = (name: string) =>
  name === "button-demo" ? "export default () => <button>Hi</button>;\n" : undefined;

test("expands previews and sources into tsx fences, drops unknown ones", () => {
  const source = `<ComponentPreview name="button-demo" previewClassName="h-auto" />

<ComponentSource name="missing" />
`;
  expect(toDocumentMarkdown(source, { resolve })).toEqual(
    "```tsx\nexport default () => <button>Hi</button>;\n```\n",
  );
});

test("turns code tabs into one section per tab", () => {
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
  expect(toDocumentMarkdown(source)).toEqual(
    "### Command\n\n```bash\nnpx add button\n```\n\n### Manual\n\nCopy the file.\n",
  );
});

test("turns steps into level-four headings", () => {
  const source = `<Steps class="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

\`\`\`bash
npm install clsx
\`\`\`

</Steps>
`;
  expect(toDocumentMarkdown(source)).toEqual(
    "#### Install the following dependencies:\n\n```bash\nnpm install clsx\n```\n",
  );
});

test("turns callouts into GitHub alerts with the title in bold", () => {
  const source = `<Callout variant="warning" title="Server-side rendering">
  Stay client-rendered for now.
</Callout>

<Callout>
  Plain note.
</Callout>
`;
  expect(toDocumentMarkdown(source)).toEqual(`> [!WARNING]
>
> **Server-side rendering**
>
> Stay client-rendered for now.

> [!NOTE]
>
> Plain note.
`);
});

test("flattens other elements to their children and drops expressions", () => {
  const source = `<div class="grid">
  <LinkedCard href="/docs/installation/solid">
    <svg role="img"><path d="M0" /></svg>
    <p class="mt-2">Solid</p>
  </LinkedCard>
</div>

{/* a comment */}

Done.
`;
  expect(toDocumentMarkdown(source)).toEqual("[Solid](/docs/installation/solid)\n\nDone.\n");
});
