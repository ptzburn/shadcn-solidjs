import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as SeparatorPrimitive from "@kobalte/core/separator";

import { cn } from "~/lib/utils.ts";
import type { ValidComponent } from "solid-js";

import { splitProps } from "solid-js";

type SeparatorRootProps<T extends ValidComponent = "div"> =
  & SeparatorPrimitive.SeparatorRootProps<T>
  & { class?: string | undefined };

const Separator = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SeparatorRootProps<T>>,
) => {
  const [local, others] = splitProps(props as SeparatorRootProps, [
    "class",
    "orientation",
  ]);
  // Rendered as a div like the upstream radix separator: tailwind's
  // preflight and typeset both style hr (stray top border, height: 0,
  // prose margins), and an explicit height would defeat self-stretch
  // (it falls back to flex-start), so h-full keeps items-center working.
  return (
    <SeparatorPrimitive.Root
      as="div"
      data-slot="separator"
      orientation={local.orientation ?? "horizontal"}
      class={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        local.class,
      )}
      {...others}
    />
  );
};

export { Separator };
