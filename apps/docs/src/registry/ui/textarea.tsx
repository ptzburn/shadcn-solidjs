import { cn } from "~/lib/utils.ts";
import { type Component, type ComponentProps, splitProps } from "solid-js";

const Textarea: Component<ComponentProps<"textarea">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <textarea
      data-slot="textarea"
      class={cn(
        "cn-textarea flex field-sizing-content min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        local.class,
      )}
      {...others}
    />
  );
};

export { Textarea };
