import * as AlertPrimitive from "@kobalte/core/alert";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";

import { cn } from "~/lib/utils.ts";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { Component, ComponentProps, ValidComponent } from "solid-js";

import { splitProps } from "solid-js";

const alertVariants = cva(
  "cn-alert group/alert relative w-full",
  {
    variants: {
      variant: {
        default: "cn-alert-variant-default",
        destructive: "cn-alert-variant-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type AlertRootProps<T extends ValidComponent = "div"> =
  & AlertPrimitive.AlertRootProps<T>
  & VariantProps<typeof alertVariants>
  & { class?: string | undefined };

const Alert = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AlertRootProps<T>>,
) => {
  const [local, others] = splitProps(props as AlertRootProps, [
    "class",
    "variant",
  ]);
  return (
    <AlertPrimitive.Root
      data-slot="alert"
      class={cn(alertVariants({ variant: local.variant }), local.class)}
      {...others}
    />
  );
};

const AlertTitle: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="alert-title"
      class={cn(
        "cn-alert-title [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        local.class,
      )}
      {...others}
    />
  );
};

const AlertDescription: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="alert-description"
      class={cn(
        "cn-alert-description [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        local.class,
      )}
      {...others}
    />
  );
};

const AlertAction: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="alert-action"
      class={cn("cn-alert-action", local.class)}
      {...others}
    />
  );
};

export { Alert, AlertAction, AlertDescription, AlertTitle };
