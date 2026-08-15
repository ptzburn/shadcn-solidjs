import type { ComponentProps } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { Component } from "solid-js";

import { omit } from "solid-js";

const Kbd: Component<ComponentProps<"kbd">> = (props) => {
  const others = omit(props, "class");
  return (
    <kbd
      data-slot="kbd"
      class={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm bg-muted px-1 font-medium font-sans text-muted-foreground text-xs dark:in-data-[slot=tooltip-content]:bg-background/10 in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background [&_svg:not([class*='size-'])]:size-3",
        props.class,
      )}
      {...others}
    />
  );
};

const KbdGroup: Component<ComponentProps<"kbd">> = (props) => {
  const others = omit(props, "class");
  return (
    <kbd
      data-slot="kbd-group"
      class={cn("inline-flex items-center gap-1", props.class)}
      {...others}
    />
  );
};

export { Kbd, KbdGroup };
