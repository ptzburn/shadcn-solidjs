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
        "cn-kbd pointer-events-none inline-flex select-none items-center justify-center",
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
      class={cn("cn-kbd-group inline-flex items-center", props.class)}
      {...others}
    />
  );
};

export { Kbd, KbdGroup };
