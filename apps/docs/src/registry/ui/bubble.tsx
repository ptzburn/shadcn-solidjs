import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Polymorphic } from "@kobalte/core/polymorphic";
import type { ComponentProps, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { Component } from "solid-js";

import { omit } from "solid-js";

const BubbleGroup: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="bubble-group"
      class={cn("cn-bubble-group flex min-w-0 flex-col", props.class)}
      {...others}
    />
  );
};

const bubbleVariants = cva(
  "cn-bubble group/bubble relative flex w-fit min-w-0 flex-col",
  {
    variants: {
      variant: {
        default: "cn-bubble-variant-default",
        secondary: "cn-bubble-variant-secondary",
        muted: "cn-bubble-variant-muted",
        tinted: "cn-bubble-variant-tinted",
        outline: "cn-bubble-variant-outline",
        ghost: "cn-bubble-variant-ghost",
        destructive: "cn-bubble-variant-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BubbleProps =
  & ComponentProps<"div">
  & VariantProps<typeof bubbleVariants>
  & { align?: "start" | "end" };

const Bubble: Component<BubbleProps> = (props) => {
  const others = omit(props, "class", "variant", "align");
  return (
    <div
      data-slot="bubble"
      data-variant={props.variant ?? "default"}
      data-align={props.align ?? "start"}
      class={cn(bubbleVariants({ variant: props.variant }), props.class)}
      {...others}
    />
  );
};

type BubbleContentProps = { class?: string | undefined };

const BubbleContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, BubbleContentProps>,
) => {
  const local = props as BubbleContentProps;
  const others = omit(local, "class");
  return (
    <Polymorphic
      as="div"
      data-slot="bubble-content"
      class={cn(
        "cn-bubble-content wrap-break-word w-fit min-w-0 max-w-full overflow-hidden [button]:text-left [button,a]:transition-colors",
        local.class,
      )}
      {...others}
    />
  );
};

const bubbleReactionsVariants = cva(
  "cn-bubble-reactions absolute z-10 flex w-fit items-center justify-center",
  {
    variants: {
      side: {
        top: "cn-bubble-reactions-side-top",
        bottom: "cn-bubble-reactions-side-bottom",
      },
      align: {
        start: "cn-bubble-reactions-align-start",
        end: "cn-bubble-reactions-align-end",
      },
    },
    defaultVariants: {
      side: "bottom",
      align: "end",
    },
  },
);

type BubbleReactionsProps =
  & ComponentProps<"div">
  & {
    align?: "start" | "end";
    side?: "top" | "bottom";
  };

const BubbleReactions: Component<BubbleReactionsProps> = (props) => {
  const others = omit(props, "class", "side", "align");
  return (
    <div
      data-slot="bubble-reactions"
      data-align={props.align ?? "end"}
      data-side={props.side ?? "bottom"}
      class={cn(
        bubbleReactionsVariants({ side: props.side, align: props.align }),
        props.class,
      )}
      {...others}
    />
  );
};

export type { BubbleProps, BubbleReactionsProps };
export { Bubble, BubbleContent, BubbleGroup, BubbleReactions, bubbleVariants };
