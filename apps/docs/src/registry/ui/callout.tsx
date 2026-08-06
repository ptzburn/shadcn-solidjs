import type { Component, ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { cn } from "~/lib/utils.ts";

const calloutVariants = cva("cn-callout", {
  variants: {
    variant: {
      default: "cn-callout-variant-default",
      success: "cn-callout-variant-success",
      warning: "cn-callout-variant-warning",
      error: "cn-callout-variant-error",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type CalloutProps =
  & ComponentProps<"div">
  & VariantProps<typeof calloutVariants>;

const Callout: Component<CalloutProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "variant"]);
  return (
    <div
      class={cn(calloutVariants({ variant: local.variant }), local.class)}
      {...others}
    />
  );
};

const CalloutTitle: Component<ComponentProps<"h3">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <h3 class={cn("cn-callout-title", local.class)} {...others} />;
};

const CalloutContent: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn("cn-callout-content", local.class)} {...others} />;
};

export { Callout, CalloutContent, CalloutTitle };
