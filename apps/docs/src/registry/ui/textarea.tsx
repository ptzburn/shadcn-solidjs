import { cn } from "~/lib/utils.ts";
import type { Component, ComponentProps } from "solid-js";

import { splitProps } from "solid-js";

const Textarea: Component<ComponentProps<"textarea">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <textarea
      data-slot="textarea"
      class={cn(
        "cn-textarea field-sizing-content flex min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        local.class,
      )}
      {...others}
    />
  );
};

export { Textarea };
