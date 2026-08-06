import { type ComponentProps, createSignal, splitProps } from "solid-js";

import { cn } from "~/lib/utils.ts";
import { Button } from "~/registry/ui/button.tsx";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/registry/ui/collapsible.tsx";
import { Separator } from "~/registry/ui/separator.tsx";

/**
 * Port of the upstream CodeCollapsibleWrapper. forceMount lives on the
 * Kobalte root (not the content like radix), keeping the collapsed
 * preview in the DOM so max-h can clip it.
 */
export function CodeCollapsibleWrapper(
  props: ComponentProps<typeof Collapsible>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  const [isOpened, setIsOpened] = createSignal(false);

  return (
    <Collapsible
      open={isOpened()}
      onOpenChange={setIsOpened}
      forceMount
      class={cn("group/collapsible relative md:-mx-1", local.class)}
      {...rest}
    >
      {/* data-not-typeset: the Kobalte separator renders an hr, which the
          typeset stylesheet would otherwise give a large top margin. */}
      <div
        data-not-typeset=""
        class="absolute top-1.5 right-9 z-10 flex items-center"
      >
        <CollapsibleTrigger
          as={Button<"button">}
          variant="ghost"
          size="sm"
          class="h-7 rounded-md px-2 text-muted-foreground"
        >
          {isOpened() ? "Collapse" : "Expand"}
        </CollapsibleTrigger>
        <Separator orientation="vertical" class="mx-1.5 h-4!" />
      </div>
      <CollapsibleContent class="relative mt-6 overflow-hidden data-[closed]:max-h-64 data-[closed]:[content-visibility:auto] [&>figure]:mt-0 [&>figure]:md:mx-0!">
        {local.children}
      </CollapsibleContent>
      <CollapsibleTrigger class="absolute inset-x-0 -bottom-2 flex h-20 items-center justify-center rounded-b-lg bg-gradient-to-b from-code/70 to-code text-sm text-muted-foreground group-data-[expanded]/collapsible:hidden">
        {isOpened() ? "Collapse" : "Expand"}
      </CollapsibleTrigger>
    </Collapsible>
  );
}
