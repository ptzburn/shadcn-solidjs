import { For } from "solid-js";
import { A, useLocation } from "@solidjs/router";

import { docsConfig } from "~/config/docs.ts";
import { cn } from "~/lib/utils.ts";
import { Button } from "~/registry/ui/button.tsx";

export function MainNav(props: { class?: string }) {
  const location = useLocation();

  return (
    <nav class={cn("items-center gap-0", props.class)}>
      <For each={docsConfig.mainNav}>
        {(item) => (
          <Button
            as={A}
            href={item.href}
            variant="ghost"
            size="sm"
            class="relative h-8 items-center px-2.5 text-sm"
            data-active={location.pathname === item.href}
          >
            {item.title}
          </Button>
        )}
      </For>
    </nav>
  );
}
