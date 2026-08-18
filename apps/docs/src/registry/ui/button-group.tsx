import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Polymorphic } from "@kobalte/core/polymorphic";
import type * as SeparatorPrimitive from "@kobalte/core/separator";
import type { ComponentProps, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { Component } from "solid-js";
import { merge, omit } from "solid-js";

import { Separator } from "./separator.tsx";

const buttonGroupVariants = cva(
  "cn-button-group group/button-group flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 [&>*>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          "cn-button-group-orientation-horizontal [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)>[data-slot=select-trigger]]:rounded-l-none [&>*:not(:first-child)>[data-slot=select-trigger]]:border-l-0 [&>*:not(:last-child)>[data-slot=select-trigger]]:rounded-r-none",
        vertical:
          "cn-button-group-orientation-vertical flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)>[data-slot=select-trigger]]:rounded-t-none [&>*:not(:first-child)>[data-slot=select-trigger]]:border-t-0 [&>*:not(:last-child)>[data-slot=select-trigger]]:rounded-b-none",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);

type ButtonGroupProps =
  & ComponentProps<"div">
  & VariantProps<typeof buttonGroupVariants>;

const ButtonGroup: Component<ButtonGroupProps> = (props) => {
  const others = omit(props, "class", "orientation");
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={props.orientation ?? "horizontal"}
      class={cn(
        buttonGroupVariants({ orientation: props.orientation }),
        props.class,
      )}
      {...others}
    />
  );
};

type ButtonGroupTextProps = { class?: string | undefined };

const ButtonGroupText = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ButtonGroupTextProps>,
) => {
  const local = props as ButtonGroupTextProps;
  const others = omit(local, "class");
  return (
    <Polymorphic
      as="div"
      class={cn(
        "cn-button-group-text flex items-center [&_svg]:pointer-events-none",
        local.class,
      )}
      {...others}
    />
  );
};

type ButtonGroupSeparatorProps<T extends ValidComponent = "div"> =
  & SeparatorPrimitive.SeparatorRootProps<T>
  & { class?: string | undefined };

const ButtonGroupSeparator = <T extends ValidComponent = "div">(
  rawProps: PolymorphicProps<T, ButtonGroupSeparatorProps<T>>,
) => {
  const props = merge(
    { orientation: "vertical" as const },
    rawProps as ButtonGroupSeparatorProps,
  );
  const others = omit(props, "class", "orientation");
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={props.orientation}
      class={cn(
        "cn-button-group-separator relative self-stretch bg-input data-[orientation=horizontal]:mx-px data-[orientation=vertical]:my-px data-[orientation=vertical]:h-auto data-[orientation=horizontal]:w-auto",
        props.class,
      )}
      {...others}
    />
  );
};

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
};
