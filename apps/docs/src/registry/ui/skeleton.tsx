import type { ComponentProps } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { Component } from "solid-js";

import { omit } from "solid-js";

const Skeleton: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="skeleton"
      class={cn(
        "animate-pulse rounded-md bg-muted",
        props.class,
      )}
      {...others}
    />
  );
};

export { Skeleton };
