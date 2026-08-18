import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as SeparatorPrimitive from "@kobalte/core/separator";
import type { ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";

import { omit } from "solid-js";

type SeparatorRootProps<T extends ValidComponent = "div"> =
  & SeparatorPrimitive.SeparatorRootProps<T>
  & {
    class?: string | undefined;
    decorative?: boolean | undefined;
  };

const Separator = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SeparatorRootProps<T>>,
) => {
  const local = props as SeparatorRootProps;
  const others = omit(local, "class", "orientation", "decorative");
  const orientation = () => local.orientation ?? "horizontal";
  const decorative = () => local.decorative ?? true;
  return (
    <SeparatorPrimitive.Root
      as="div"
      data-slot="separator"
      data-orientation={orientation()}
      role={decorative() ? "none" : "separator"}
      aria-orientation={!decorative() && orientation() === "vertical"
        ? "vertical"
        : undefined}
      class={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
        local.class,
      )}
      {...others}
    />
  );
};

export { Separator };
