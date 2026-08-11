import { A, useLocation } from "@solidjs/router";
import { IconArrowLeft, IconArrowRight } from "~/components/icons.tsx";

import { componentPages, COMPONENTS_INDEX, docsConfig } from "~/config/docs.ts";
import { Button } from "~/registry/ui/button.tsx";
import { Show } from "solid-js";

const categories = docsConfig.sidebarNav.map((category) => category.items);

/**
 * Neighbours wrap within their sidebar category, like the upstream page
 * tree where the adjacent base folders repeat the component list — there
 * the first component's previous is the last component and vice versa.
 *
 * The Components index is the exception: upstream puts it first in the
 * tree, so it has no previous and its next is the first component.
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
      if (location.pathname === COMPONENTS_INDEX) return undefined;
      const match = found();
      if (!match) return undefined;
      const { items, index } = match;
      return items[(index - 1 + items.length) % items.length];
    },
    next: () => {
      if (location.pathname === COMPONENTS_INDEX) return componentPages[0];
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
            class="shadow-none hover:bg-secondary/80"
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
            class="ml-auto shadow-none hover:bg-secondary/80"
          >
            {page().title} <IconArrowRight />
          </Button>
        )}
      </Show>
    </div>
  );
}
