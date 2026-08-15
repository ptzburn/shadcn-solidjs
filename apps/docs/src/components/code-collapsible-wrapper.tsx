import type { ComponentProps } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";

import { Button } from "~/registry/ui/button.tsx";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/registry/ui/collapsible.tsx";
import { Separator } from "~/registry/ui/separator.tsx";
import { createSignal, omit } from "solid-js";

/**
 * Port of the upstream CodeCollapsibleWrapper. forceMount lives on the
 * Kobalte root (not the content like radix), keeping the collapsed
 * preview in the DOM so max-h can clip it.
 */
export function CodeCollapsibleWrapper(
  props: ComponentProps<typeof Collapsible>,
) {
  const rest = omit(props, "class", "children");
  const [isOpened, setIsOpened] = createSignal(false);

  return (
    <Collapsible
      open={isOpened()}
      onOpenChange={setIsOpened}
      forceMount
      class={cn("group/collapsible relative md:-mx-1", props.class)}
      {...rest}
    >
      <div class="absolute top-1.5 right-9 z-10 flex items-center">
        <CollapsibleTrigger
          as={Button<"button">}
          variant="ghost"
          size="sm"
          class="text-muted-foreground"
        >
          {isOpened() ? "Collapse" : "Expand"}
        </CollapsibleTrigger>
        <Separator orientation="vertical" class="self-center! mx-1.5 h-4!" />
      </div>
      <CollapsibleContent class="data-[closed]:[content-visibility:auto] relative mt-6 overflow-hidden [&>figure]:mt-0 data-[closed]:max-h-64 [&>figure]:md:mx-0!">
        {props.children}
      </CollapsibleContent>
      <CollapsibleTrigger class="absolute inset-x-0 -bottom-2 flex h-20 items-center justify-center rounded-b-(--docs-surface-radius) bg-gradient-to-b from-code/70 to-code text-muted-foreground text-sm group-data-[expanded]/collapsible:hidden">
        {isOpened() ? "Collapse" : "Expand"}
      </CollapsibleTrigger>
    </Collapsible>
  );
}
