import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Polymorphic } from "@kobalte/core/polymorphic";
import type { ComponentProps, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { Component } from "solid-js";
import { omit } from "solid-js";

const markerVariants = cva(
  "group/marker relative flex min-h-4 w-full items-center gap-2 text-left text-sm text-muted-foreground [a]:underline [a]:underline-offset-3 [a]:hover:text-foreground [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "",
        separator:
          "before:mr-1 before:h-px before:min-w-0 before:flex-1 before:bg-border after:ml-1 after:h-px after:min-w-0 after:flex-1 after:bg-border",
        border: "border-b border-border pb-2",
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
        "size-4 shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
        "wrap-break-word min-w-0 *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center",
        props.class,
      )}
      {...others}
    />
  );
};

export type { MarkerProps };
export { Marker, MarkerContent, MarkerIcon, markerVariants };
