import { cn } from "~/lib/utils.ts";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { type Component, type ComponentProps, splitProps } from "solid-js";

const Spinner: Component<ComponentProps<"svg">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <IconPlaceholder
      lucide="loader-circle"
      tabler="loader"
      ph="spinner"
      ri="loader-line"
      hugeicons="loading-03"
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      class={cn("size-4 animate-spin", local.class)}
      {...others}
    />
  );
};

export { Spinner };
