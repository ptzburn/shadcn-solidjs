import type { ComponentProps } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { Component } from "solid-js";

import { omit } from "solid-js";

const Input: Component<ComponentProps<"input">> = (props) => {
  const others = omit(props, "class", "type");

  return (
    <input
      type={props.type}
      data-slot="input"
      class={cn(
        "cn-input w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        props.class,
      )}
      {...others}
    />
  );
};

export { Input };
