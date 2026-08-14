import { Title } from "@solidjs/meta";

import { ModeSwitcher } from "~/components/mode-switcher.tsx";

import type { ParentProps } from "solid-js";

export default function AppLayout(props: ParentProps) {
  return (
    <>
      <Title>shadcn-solidjs</Title>
      <header class="border-b">
        <div class="mx-auto flex h-14 max-w-3xl items-center gap-6 px-6">
          <a href="/" class="font-semibold">shadcn-solidjs</a>
          <a
            href="/docs/components/button"
            class="text-muted-foreground text-sm hover:text-foreground"
          >
            Docs
          </a>
          <div class="ml-auto">
            <ModeSwitcher />
          </div>
        </div>
      </header>
      <main class="mx-auto max-w-3xl px-6 py-10">{props.children}</main>
    </>
  );
}
