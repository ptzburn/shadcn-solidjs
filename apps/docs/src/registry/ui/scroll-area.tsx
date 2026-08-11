import { cn } from "~/lib/utils.ts";

import { type Component, type ComponentProps, splitProps } from "solid-js";

// Kobalte ships no scroll-area primitive, so this follows upstream's
// react-aria base rather than the radix one: the native scrollbar is styled
// with scrollbar-width and scrollbar-color instead of a rendered viewport,
// scrollbar and thumb. There is no ScrollBar export for the same reason.
const ScrollArea: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <div
      data-slot="scroll-area"
      class={cn(
        "[scrollbar-color:var(--color-border)_transparent] [scrollbar-width:thin] cn-scroll-area relative overflow-auto outline-none focus-visible:outline-1 focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        local.class,
      )}
      {...others}
    />
  );
};

export { ScrollArea };
