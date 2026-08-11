import { A } from "@solidjs/router";
import { DocsCopyPage } from "~/components/docs-copy-page.tsx";

import { useDocsNeighbours } from "~/components/docs-pager.tsx";
import { IconArrowLeft, IconArrowRight } from "~/components/icons.tsx";
import { MetaTags } from "~/components/meta-tags.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { Show } from "solid-js";

type HeaderProps = {
  title: string;
  description: string;
};

export function MDXHeader(props: HeaderProps) {
  const { previous, next } = useDocsNeighbours();

  return (
    <div data-not-typeset="" class="flex flex-col gap-2 pb-8">
      <MetaTags title={props.title} description={props.description} />
      <div class="flex items-center justify-between md:items-start">
        <h1 class="scroll-m-24 font-semibold text-3xl tracking-tight">
          {props.title}
        </h1>
        <div class="docs-nav flex items-center gap-2">
          <div class="hidden sm:block">
            <DocsCopyPage />
          </div>
          <div class="ml-auto flex gap-2">
            <Show when={previous()}>
              {(page) => (
                <Button
                  as={A}
                  href={page().href}
                  variant="secondary"
                  size="icon"
                  class="extend-touch-target shadow-none hover:bg-secondary/80 max-md:size-8"
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
                  class="extend-touch-target shadow-none hover:bg-secondary/80 max-md:size-8"
                >
                  <span class="sr-only">Next</span>
                  <IconArrowRight />
                </Button>
              )}
            </Show>
          </div>
        </div>
      </div>
      <p class="text-balance text-muted-foreground text-[1.05rem] sm:text-base md:max-w-[80%]">
        {props.description}
      </p>
    </div>
  );
}
