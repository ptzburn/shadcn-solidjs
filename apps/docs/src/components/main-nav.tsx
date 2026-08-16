import { docsConfig } from "~/config/docs.ts";

import { cn } from "~/lib/utils.ts";
import { Button } from "~/registry/ui/button.tsx";
import { For } from "solid-js";

// Plain anchors instead of main's `A`: the next-branch router has no A
// component and intercepts every same-origin anchor click itself, stamping
// `data-active` on matching links — so main's manual attribute goes.
export function MainNav(props: { class?: string }) {
  return (
    <nav class={cn("items-center gap-0", props.class)}>
      <For each={docsConfig.mainNav}>
        {(item) => (
          <Button as="a" href={item.href} variant="ghost" size="sm">
            {item.title}
          </Button>
        )}
      </For>
    </nav>
  );
}
