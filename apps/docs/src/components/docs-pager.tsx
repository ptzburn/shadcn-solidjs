import { Show } from "solid-js";
import { A, useLocation } from "@solidjs/router";

import { IconArrowLeft, IconArrowRight } from "~/components/icons.tsx";
import { docsConfig } from "~/config/docs.ts";
import { Button } from "~/registry/ui/button.tsx";

const categories = docsConfig.sidebarNav.map((category) => category.items);

/**
 * Neighbours wrap within their sidebar category, like the upstream page
 * tree where the adjacent base folders repeat the component list — there
 * the first component's previous is the last component and vice versa.
 */
export function useDocsNeighbours() {
  const location = useLocation();
  const found = () => {
    for (const items of categories) {
      const index = items.findIndex((item) => item.href === location.pathname);
      if (index !== -1) return { items, index };
    }
    return undefined;
  };

  return {
    previous: () => {
      const match = found();
      if (!match) return undefined;
      const { items, index } = match;
      return items[(index - 1 + items.length) % items.length];
    },
    next: () => {
      const match = found();
      if (!match) return undefined;
      const { items, index } = match;
      return items[(index + 1) % items.length];
    },
  };
}

export function DocsPager() {
  const { previous, next } = useDocsNeighbours();

  return (
    <div class="hidden h-16 w-full items-center gap-2 px-4 sm:flex sm:px-0">
      <Show when={previous()}>
        {(page) => (
          <Button
            as={A}
            href={page().href}
            variant="secondary"
            size="sm"
            class="h-8 gap-1.5 px-3 text-sm shadow-none hover:bg-secondary/80 [&_svg:not([class*='size-'])]:size-4"
          >
            <IconArrowLeft /> {page().title}
          </Button>
        )}
      </Show>
      <Show when={next()}>
        {(page) => (
          <Button
            as={A}
            href={page().href}
            variant="secondary"
            size="sm"
            class="ml-auto h-8 gap-1.5 px-3 text-sm shadow-none hover:bg-secondary/80 [&_svg:not([class*='size-'])]:size-4"
          >
            {page().title} <IconArrowRight />
          </Button>
        )}
      </Show>
    </div>
  );
}
