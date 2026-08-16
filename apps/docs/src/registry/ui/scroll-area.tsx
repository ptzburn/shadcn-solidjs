import type { ComponentProps } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { Component } from "solid-js";

import { omit } from "solid-js";

// Kobalte ships no scroll-area primitive, so this follows upstream's
// react-aria base rather than the radix one: the native scrollbar is styled
// with scrollbar-width and scrollbar-color instead of a rendered viewport,
// scrollbar and thumb. There is no ScrollBar export for the same reason.
const ScrollArea: Component<ComponentProps<"div">> = (props) => {
  const rest = omit(props, "class");

  return (
    <div
      data-slot="scroll-area"
      class={cn(
        "[scrollbar-color:var(--color-border)_transparent] [scrollbar-width:thin] relative overflow-auto outline-none focus-visible:outline-1 focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        props.class,
      )}
      {...rest}
    />
  );
};

export { ScrollArea };
