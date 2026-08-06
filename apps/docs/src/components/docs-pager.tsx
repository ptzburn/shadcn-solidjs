import { Show } from "solid-js";
import { A, useLocation } from "@solidjs/router";

import { IconArrowLeft, IconArrowRight } from "~/components/icons.tsx";
import { docsConfig } from "~/config/docs.ts";
import { Button } from "~/registry/ui/button.tsx";

const pages = docsConfig.sidebarNav.flatMap((category) => category.items);

export function useDocsNeighbours() {
  const location = useLocation();
  const index = () =>
    pages.findIndex((item) => item.href === location.pathname);

  return {
    previous: () => (index() > 0 ? pages[index() - 1] : undefined),
    next: () =>
      index() >= 0 && index() < pages.length - 1
        ? pages[index() + 1]
        : undefined,
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
