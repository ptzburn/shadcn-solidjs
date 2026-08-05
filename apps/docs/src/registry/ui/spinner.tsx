import { cn } from "~/lib/utils.ts";

import { type Component, type ComponentProps, splitProps } from "solid-js";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

const Spinner: Component<ComponentProps<"svg">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <IconPlaceholder
      lucide="loader-circle"
      tabler="loader-2"
      ph="circle-notch"
      ri="loader-4-line"
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
