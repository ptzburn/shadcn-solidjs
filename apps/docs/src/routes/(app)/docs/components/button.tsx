import { Title } from "@solidjs/meta";
import type { JSX } from "@solidjs/web";
import { Button } from "~/registry/ui/button.tsx";

import type { ParentProps } from "solid-js";

function Demo(props: ParentProps<{ title: string }>) {
  return (
    <section class="flex flex-col gap-3">
      <h2 class="font-semibold text-xl tracking-tight">{props.title}</h2>
      <div class="flex min-h-24 flex-wrap items-center justify-center gap-3 rounded-xl border p-8">
        {props.children}
      </div>
    </section>
  );
}

function CodeBlock(props: { children: JSX.Element }) {
  return (
    <pre class="overflow-x-auto rounded-lg bg-code p-4 text-code-foreground text-sm">
      <code>{props.children}</code>
    </pre>
  );
}

export default function ButtonDocs() {
  return (
    <article class="flex flex-col gap-10">
      <Title>Button - shadcn-solidjs</Title>

      <header class="flex flex-col gap-2">
        <h1 class="font-semibold text-3xl tracking-tight">Button</h1>
        <p class="text-muted-foreground">
          Displays a button or a component that looks like a button. Built on
          the Kobalte 2 alpha Button primitive, running on SolidJS 2.0.
        </p>
      </header>

      <Demo title="Preview">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </Demo>

      <section class="flex flex-col gap-3">
        <h2 class="font-semibold text-xl tracking-tight">Installation</h2>
        <CodeBlock>npx @ptzburn/shadcn-solidjs@latest add button</CodeBlock>
        <p class="text-muted-foreground text-sm">
          Or install the only dependency manually and copy{" "}
          <code class="rounded bg-code px-1 py-0.5">
            src/registry/ui/button.tsx
          </code>{" "}
          into your project:
        </p>
        <CodeBlock>npm install @kobalte/core@alpha</CodeBlock>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-semibold text-xl tracking-tight">Usage</h2>
        <CodeBlock>
          {`import { Button } from "~/components/ui/button.tsx";

<Button variant="outline">Button</Button>`}
        </CodeBlock>
      </section>

      <Demo title="Size">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </Demo>

      <Demo title="Disabled">
        <Button disabled>Disabled</Button>
        <Button variant="outline" disabled>Disabled outline</Button>
      </Demo>

      <Demo title="As child">
        <Button as="a" href="https://kobalte.dev" target="_blank">
          Rendered as an anchor
        </Button>
      </Demo>

      <section class="flex flex-col gap-3">
        <h2 class="font-semibold text-xl tracking-tight">API reference</h2>
        <p class="text-muted-foreground text-sm">
          The Button accepts every prop of Kobalte's Button primitive plus{" "}
          <code class="rounded bg-code px-1 py-0.5">variant</code>{" "}
          (default, secondary, outline, ghost, destructive, link) and{" "}
          <code class="rounded bg-code px-1 py-0.5">size</code>{" "}
          (xs, sm, default, lg, icon, icon-xs, icon-sm, icon-lg). Use{" "}
          <code class="rounded bg-code px-1 py-0.5">as</code>{" "}
          to change the rendered element.
        </p>
      </section>
    </article>
  );
}
