import type { ComponentProps } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { Component } from "solid-js";

import { omit } from "solid-js";

const Textarea: Component<ComponentProps<"textarea">> = (props) => {
  const others = omit(props, "class");

  return (
    <textarea
      data-slot="textarea"
      class={cn(
        "cn-textarea field-sizing-content flex min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        props.class,
      )}
      {...others}
    />
  );
};

export { Textarea };
