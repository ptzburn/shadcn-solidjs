import { cn } from "~/lib/utils.ts";
import type { Component, ComponentProps } from "solid-js";

import { splitProps } from "solid-js";

const Skeleton: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="skeleton"
      class={cn(
        "cn-skeleton animate-pulse",
        local.class,
      )}
      {...others}
    />
  );
};

export { Skeleton };
