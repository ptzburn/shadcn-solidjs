import type { ComponentProps } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import type { Component } from "solid-js";
import { omit } from "solid-js";

const Spinner: Component<ComponentProps<"svg">> = (props) => {
  const others = omit(props, "class");

  return (
    <IconPlaceholder
      lucide="loader"
      tabler="loader-2"
      ph="circle-notch"
      ri="loader-4-line"
      hugeicons="loading-01"
      role="status"
      aria-label="Loading"
      class={cn("size-4 animate-spin", props.class)}
      {...others}
    />
  );
};

export default function SpinnerCustom() {
  return (
    <div class="flex items-center gap-4">
      <Spinner />
    </div>
  );
}
