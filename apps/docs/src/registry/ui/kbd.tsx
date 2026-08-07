import { cn } from "~/lib/utils.ts";

import { type Component, type ComponentProps, splitProps } from "solid-js";

const Kbd: Component<ComponentProps<"kbd">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <kbd
      data-slot="kbd"
      class={cn(
        "cn-kbd pointer-events-none inline-flex items-center justify-center select-none",
        local.class,
      )}
      {...others}
    />
  );
};

const KbdGroup: Component<ComponentProps<"kbd">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <kbd
      data-slot="kbd-group"
      class={cn("cn-kbd-group inline-flex items-center", local.class)}
      {...others}
    />
  );
};

export { Kbd, KbdGroup };
