import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

import { cn } from "~/lib/utils.ts";

export function PageNav(props: ComponentProps<"div">) {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <div class={cn("container-wrapper scroll-mt-24", local.class)} {...others}>
      <div class="container flex items-center justify-between gap-4 py-4">
        {local.children}
      </div>
    </div>
  );
}
