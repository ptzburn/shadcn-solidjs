import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as SeparatorPrimitive from "@kobalte/core/separator";

import { cn } from "~/lib/utils.ts";
import type { ValidComponent } from "solid-js";

import { splitProps } from "solid-js";

type SeparatorRootProps<T extends ValidComponent = "div"> =
  & SeparatorPrimitive.SeparatorRootProps<T>
  & {
    class?: string | undefined;
    decorative?: boolean | undefined;
  };

const Separator = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SeparatorRootProps<T>>,
) => {
  const [local, others] = splitProps(props as SeparatorRootProps, [
    "class",
    "orientation",
    "decorative",
  ]);
  const orientation = () => local.orientation ?? "horizontal";
  const decorative = () => local.decorative ?? true;
  // Rendered as a div like the upstream radix separator: tailwind's
  // preflight and typeset both style hr (stray top border, height: 0,
  // prose margins).
  //
  // Note that a vertical separator stretches instead of taking h-full: a
  // percentage height collapses to 0 inside a flex row that has no definite
  // height. Setting an explicit height on it defeats align-self: stretch
  // (the item falls back to flex-start), so pair a forced height with
  // self-center.
  //
  // Kobalte has no `decorative` prop and always announces the separator, so
  // the semantics are authored here instead of being derived from the
  // primitive's `orientation`: a decorative separator gets `role="none"` and
  // no `aria-orientation`, exactly like the radix one.
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
