import type { ComponentProps } from "solid-js";
import { createSignal, For, splitProps } from "solid-js";

import { docsConfig } from "~/config/docs.ts";
import { cn } from "~/lib/utils.ts";
import { Button } from "~/registry/ui/button.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/registry/ui/popover.tsx";

export function MobileNav(props: { class?: string }) {
  const [open, setOpen] = createSignal(false);

  return (
    <Popover open={open()} onOpenChange={setOpen} placement="bottom-start">
      <PopoverTrigger
        as={Button<"button">}
        variant="ghost"
        class={cn(
          "extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 !p-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent",
          props.class,
        )}
      >
        <div class="relative flex h-8 w-4 items-center justify-center">
          <div class="relative size-4">
            <span
              class={cn(
                "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100",
                open() ? "top-[0.4rem] -rotate-45" : "top-1",
              )}
            />
            <span
              class={cn(
                "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100",
                open() ? "top-[0.4rem] rotate-45" : "top-2.5",
              )}
            />
          </div>
          <span class="sr-only">Toggle Menu</span>
        </div>
        <span class="flex h-8 items-center text-lg font-medium leading-none">
          Menu
        </span>
      </PopoverTrigger>
      <PopoverContent class="no-scrollbar h-[calc(100svh-var(--header-height))] w-svw max-w-none overflow-y-auto rounded-none border-none bg-background/90 p-0 shadow-none backdrop-blur duration-100">
        <div class="flex flex-col gap-12 overflow-auto px-6 py-6">
          <div class="flex flex-col gap-4">
            <div class="text-sm font-medium text-muted-foreground">Menu</div>
            <div class="flex flex-col gap-3">
              <For each={docsConfig.mainNav}>
                {(item) => (
                  <MobileLink href={item.href} onOpenChange={setOpen}>
                    {item.title}
                  </MobileLink>
                )}
              </For>
            </div>
          </div>
          <div class="flex flex-col gap-8">
            <For each={docsConfig.sidebarNav}>
              {(category) => (
                <div class="flex flex-col gap-4">
                  <div class="text-sm font-medium text-muted-foreground">
                    {category.title}
                  </div>
                  <div class="flex flex-col gap-3">
                    <For each={category.items}>
                      {(item) => (
                        <MobileLink href={item.href} onOpenChange={setOpen}>
                          {item.title}
                        </MobileLink>
                      )}
                    </For>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface MobileLinkProps extends ComponentProps<"a"> {
  onOpenChange?: (open: boolean) => void;
}

function MobileLink(props: MobileLinkProps) {
  const [local, others] = splitProps(props, ["class", "onOpenChange"]);

  return (
    <a
      {...others}
      class={cn("flex items-center gap-2 text-2xl font-medium", local.class)}
      onClick={() => local.onOpenChange?.(false)}
    />
  );
}
