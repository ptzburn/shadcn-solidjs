import { useLocation } from "@solidjs/router";
import { docsConfig } from "~/config/docs.ts";

import { cn } from "~/lib/utils.ts";
import { Button } from "~/registry/ui/button.tsx";
import { For } from "solid-js";

// Plain anchors instead of main's `A`: the next-branch router has no A
// component and intercepts every same-origin anchor click itself.
export function MainNav(props: { class?: string }) {
  const location = useLocation();

  return (
    <nav class={cn("items-center gap-0", props.class)}>
      <For each={docsConfig.mainNav}>
        {(item) => (
          <Button
            as="a"
            href={item.href}
            variant="ghost"
            size="sm"
            data-active={location.pathname === item.href ? "true" : undefined}
          >
            {item.title}
          </Button>
        )}
      </For>
    </nav>
  );
}
