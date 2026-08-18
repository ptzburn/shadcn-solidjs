import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Polymorphic } from "@kobalte/core/polymorphic";
import type { ComponentProps, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { Component } from "solid-js";
import { omit } from "solid-js";

const markerVariants = cva(
  "cn-marker group/marker relative flex w-full items-center",
  {
    variants: {
      variant: {
        default: "cn-marker-variant-default",
        separator: "cn-marker-variant-separator",
        border: "cn-marker-variant-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type MarkerProps =
  & VariantProps<typeof markerVariants>
  & { class?: string | undefined };

const Marker = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, MarkerProps>,
) => {
  const local = props as MarkerProps;
  const others = omit(local, "class", "variant");
  return (
    <Polymorphic
      as="div"
      data-slot="marker"
      data-variant={local.variant ?? "default"}
      class={cn(
        markerVariants({ variant: local.variant, class: local.class }),
      )}
      {...others}
    />
  );
};

const MarkerIcon: Component<ComponentProps<"span">> = (props) => {
  const others = omit(props, "class");
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      class={cn(
        "cn-marker-icon shrink-0",
        props.class,
      )}
      {...others}
    />
  );
};

const MarkerContent: Component<ComponentProps<"span">> = (props) => {
  const others = omit(props, "class");
  return (
    <span
      data-slot="marker-content"
      class={cn(
        "cn-marker-content wrap-break-word min-w-0",
        props.class,
      )}
      {...others}
    />
  );
};

export type { MarkerProps };
export { Marker, MarkerContent, MarkerIcon, markerVariants };
