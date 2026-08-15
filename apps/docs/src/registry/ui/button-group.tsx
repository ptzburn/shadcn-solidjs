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

// Kobalte's Select root wraps its trigger in a `<div role="group">`, so
// unlike radix the trigger is never a direct child of the group — the
// `[&>*>[data-slot=select-trigger]]` selectors reach one level deeper to
// keep the joined rounding and collapsed borders working.
const buttonGroupVariants = cva(
  "group/button-group flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 *:focus-visible:relative *:focus-visible:z-10 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg [&>*>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          "[&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg! [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)>[data-slot=select-trigger]]:rounded-l-none [&>*:not(:first-child)>[data-slot=select-trigger]]:border-l-0 [&>*:not(:last-child)>[data-slot=select-trigger]]:rounded-r-none",
        vertical:
          "flex-col [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg! [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)>[data-slot=select-trigger]]:rounded-t-none [&>*:not(:first-child)>[data-slot=select-trigger]]:border-t-0 [&>*:not(:last-child)>[data-slot=select-trigger]]:rounded-b-none",
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
        "flex items-center gap-2 rounded-lg border bg-muted px-2.5 font-medium text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
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
        "relative self-stretch bg-input data-[orientation=horizontal]:mx-px data-[orientation=vertical]:my-px data-[orientation=vertical]:h-auto data-[orientation=horizontal]:w-auto",
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
