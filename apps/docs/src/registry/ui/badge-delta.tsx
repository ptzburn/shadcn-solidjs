import type { Component, JSXElement } from "solid-js";
import { createEffect, on, splitProps } from "solid-js";

import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { cn } from "~/lib/utils.ts";
import type { BadgeProps } from "~/registry/ui/badge.tsx";
import { Badge } from "~/registry/ui/badge.tsx";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

type DeltaType =
  | "increase"
  | "moderateIncrease"
  | "unchanged"
  | "moderateDecrease"
  | "decrease";

const badgeDeltaVariants = cva("", {
  variants: {
    variant: {
      success: "bg-success text-success-foreground hover:bg-success",
      warning: "bg-warning text-warning-foreground hover:bg-warning",
      error: "bg-error text-error-foreground hover:bg-error",
    },
  },
});
type DeltaVariant = NonNullable<
  VariantProps<typeof badgeDeltaVariants>["variant"]
>;

const iconMap: {
  [key in DeltaType]: (props: { class?: string }) => JSXElement;
} = {
  increase: (props) => (
    <IconPlaceholder
      lucide="arrow-up"
      tabler="arrow-up"
      ph="arrow-up"
      ri="arrow-up-line"
      hugeicons="arrow-up-02"
      class={props.class}
    />
  ),
  moderateIncrease: (props) => (
    <IconPlaceholder
      lucide="arrow-up-right"
      tabler="arrow-up-right"
      ph="arrow-up-right"
      ri="arrow-right-up-line"
      hugeicons="arrow-up-right-01"
      class={props.class}
    />
  ),
  unchanged: (props) => (
    <IconPlaceholder
      lucide="arrow-right"
      tabler="arrow-right"
      ph="arrow-right"
      ri="arrow-right-line"
      hugeicons="arrow-right-02"
      class={props.class}
    />
  ),
  moderateDecrease: (props) => (
    <IconPlaceholder
      lucide="arrow-down-right"
      tabler="arrow-down-right"
      ph="arrow-down-right"
      ri="arrow-right-down-line"
      hugeicons="arrow-down-right-01"
      class={props.class}
    />
  ),
  decrease: (props) => (
    <IconPlaceholder
      lucide="arrow-down"
      tabler="arrow-down"
      ph="arrow-down"
      ri="arrow-down-line"
      hugeicons="arrow-down-02"
      class={props.class}
    />
  ),
};

const variantMap: { [key in DeltaType]: DeltaVariant } = {
  increase: "success",
  moderateIncrease: "success",
  unchanged: "warning",
  moderateDecrease: "error",
  decrease: "error",
};

type BadgeDeltaProps = Omit<BadgeProps, "variant"> & {
  deltaType: DeltaType;
  children?: JSXElement;
};

const BadgeDelta: Component<BadgeDeltaProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children", "deltaType"]);

  // eslint-disable-next-line solid/reactivity
  let Icon = iconMap[local.deltaType];
  createEffect(
    on(
      () => local.deltaType,
      () => {
        Icon = iconMap[local.deltaType];
      },
    ),
  );

  return (
    <Badge
      class={cn(
        badgeDeltaVariants({ variant: variantMap[local.deltaType] }),
        local.class,
      )}
      {...others}
    >
      <span class="flex gap-1">
        <Icon class="size-4" />
        {local.children}
      </span>
    </Badge>
  );
};

export { BadgeDelta };
