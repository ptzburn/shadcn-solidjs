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
      class={cn("flex min-w-0 flex-col gap-2", props.class)}
      {...others}
    />
  );
};

const bubbleVariants = cva(
  "max-w-[80%] gap-1 data-[align=end]:self-end data-[variant=ghost]:max-w-full group-data-[align=end]/message:self-end group/bubble relative flex w-fit min-w-0 flex-col",
  {
    variants: {
      variant: {
        default:
          "*:data-[slot=bubble-content]:bg-primary *:data-[slot=bubble-content]:text-primary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary/80",
        secondary:
          "*:data-[slot=bubble-content]:bg-secondary *:data-[slot=bubble-content]:text-secondary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
        muted:
          "*:data-[slot=bubble-content]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_5%)]",
        tinted:
          "*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.93_calc(c*0.4)_h)] dark:*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.3_calc(c*0.4)_h)] *:data-[slot=bubble-content]:text-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.88_calc(c*0.5)_h)] dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.35_calc(c*0.5)_h)]",
        outline:
          "*:data-[slot=bubble-content]:bg-background *:data-[slot=bubble-content]:border-border [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-input/30",
        ghost:
          "border-none *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted/50",
        destructive:
          "*:data-[slot=bubble-content]:bg-destructive/10 dark:*:data-[slot=bubble-content]:bg-destructive/20 *:data-[slot=bubble-content]:text-destructive [&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/20 dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/30",
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
        "wrap-break-word w-fit min-w-0 max-w-full overflow-hidden rounded-xl border border-transparent px-3 py-2 text-sm leading-relaxed group-data-[align=end]/bubble:self-end [button]:text-left [button,a]:outline-none [button,a]:transition-colors [button,a]:focus-visible:border-ring [button,a]:focus-visible:ring-3 [button,a]:focus-visible:ring-ring/50",
        local.class,
      )}
      {...others}
    />
  );
};

const bubbleReactionsVariants = cva(
  "shrink-0 gap-1 rounded-full bg-muted px-1.5 py-0.5 text-sm ring-3 ring-card has-[button]:p-0 absolute z-10 flex w-fit items-center justify-center",
  {
    variants: {
      side: {
        top: "top-0 -translate-y-3/4",
        bottom: "bottom-0 translate-y-3/4",
      },
      align: {
        start: "left-3",
        end: "right-3",
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
