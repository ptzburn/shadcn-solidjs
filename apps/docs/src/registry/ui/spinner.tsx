import type { ComponentProps } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import type { Component } from "solid-js";
import { omit } from "solid-js";

const Spinner: Component<ComponentProps<"svg">> = (props) => {
  const others = omit(props, "class");

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
      class={cn("size-4 animate-spin", props.class)}
      {...others}
    />
  );
};

export { Spinner };
