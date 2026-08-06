import { cn } from "~/lib/utils.ts";
import { type Component, type ComponentProps, splitProps } from "solid-js";

const Input: Component<ComponentProps<"input">> = (props) => {
  const [local, others] = splitProps(props, ["class", "type"]);

  return (
    <input
      type={local.type}
      data-slot="input"
      class={cn(
        "cn-input w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        local.class,
      )}
      {...others}
    />
  );
};

export { Input };
