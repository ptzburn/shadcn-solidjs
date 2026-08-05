import { Show } from "solid-js";
import { A } from "@solidjs/router";

import { useDocsNeighbours } from "~/components/docs-pager.tsx";
import {
  IconArrowLeft,
  IconArrowRight,
  IconExternalLink,
} from "~/components/icons.tsx";
import { cn } from "~/lib/utils.ts";
import { badgeVariants } from "~/registry/ui/badge.tsx";
import { Button } from "~/registry/ui/button.tsx";

type HeaderProps = {
  title: string;
  description: string;
  docs?: string;
};

export function MDXHeader(props: HeaderProps) {
  const { previous, next } = useDocsNeighbours();

  return (
    <div class="flex flex-col gap-2 pb-8">
      <div class="flex items-center justify-between md:items-start">
        <h1 class="scroll-m-24 text-3xl font-semibold tracking-tight">
          {props.title}
        </h1>
        <div class="docs-nav flex items-center gap-2">
          <div class="ml-auto flex gap-2">
            <Show when={previous()}>
              {(page) => (
                <Button
                  as={A}
                  href={page().href}
                  variant="secondary"
                  size="icon"
                  class="extend-touch-target size-8 shadow-none md:size-7"
                >
                  <IconArrowLeft />
                  <span class="sr-only">Previous</span>
                </Button>
              )}
            </Show>
            <Show when={next()}>
              {(page) => (
                <Button
                  as={A}
                  href={page().href}
                  variant="secondary"
                  size="icon"
                  class="extend-touch-target size-8 shadow-none md:size-7"
                >
                  <span class="sr-only">Next</span>
                  <IconArrowRight />
                </Button>
              )}
            </Show>
          </div>
        </div>
      </div>
      <p class="text-balance text-[1.05rem] text-muted-foreground sm:text-base md:max-w-[80%]">
        {props.description}
      </p>
      <Show when={props.docs}>
        {(docs) => (
          <A
            href={docs()}
            target="_blank"
            rel="noreferrer"
            class={cn(badgeVariants({ variant: "secondary" }), "w-fit gap-1")}
          >
            Docs
            <IconExternalLink class="size-3" />
          </A>
        )}
      </Show>
    </div>
  );
}
