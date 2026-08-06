import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Polymorphic } from "@kobalte/core/polymorphic";

import { cn } from "~/lib/utils.ts";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ValidComponent } from "solid-js";

import { splitProps } from "solid-js";

const badgeVariants = cva(
  "cn-badge group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "cn-badge-variant-default",
        secondary: "cn-badge-variant-secondary",
        destructive: "cn-badge-variant-destructive",
        outline: "cn-badge-variant-outline",
        ghost: "cn-badge-variant-ghost",
        link: "cn-badge-variant-link",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps<T extends ValidComponent = "span"> =
  & VariantProps<typeof badgeVariants>
  & { class?: string | undefined };

const Badge = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, BadgeProps<T>>,
) => {
  const [local, others] = splitProps(props as BadgeProps, ["class", "variant"]);
  return (
    <Polymorphic
      as="span"
      data-slot="badge"
      data-variant={local.variant ?? "default"}
      class={cn(badgeVariants({ variant: local.variant }), local.class)}
      {...others}
    />
  );
};

export type { BadgeProps };
export { Badge, badgeVariants };
