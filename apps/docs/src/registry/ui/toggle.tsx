import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as ToggleButtonPrimitive from "@kobalte/core/toggle-button";

import { cn } from "~/lib/utils.ts";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import type { ValidComponent } from "solid-js";

import { splitProps } from "solid-js";

const toggleVariants = cva(
  "cn-toggle group/toggle inline-flex items-center justify-center whitespace-nowrap outline-none hover:bg-muted focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "cn-toggle-variant-default",
        outline: "cn-toggle-variant-outline",
      },
      size: {
        default: "cn-toggle-size-default",
        sm: "cn-toggle-size-sm",
        lg: "cn-toggle-size-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ToggleButtonRootProps<T extends ValidComponent = "button"> =
  & ToggleButtonPrimitive.ToggleButtonRootProps<T>
  & VariantProps<typeof toggleVariants>
  & { class?: string | undefined };

const Toggle = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ToggleButtonRootProps<T>>,
) => {
  const [local, others] = splitProps(props as ToggleButtonRootProps, [
    "class",
    "variant",
    "size",
  ]);
  return (
    <ToggleButtonPrimitive.Root
      data-slot="toggle"
      class={cn(
        toggleVariants({ variant: local.variant, size: local.size }),
        local.class,
      )}
      {...others}
    />
  );
};

export type { ToggleButtonRootProps as ToggleProps };
export { Toggle, toggleVariants };
