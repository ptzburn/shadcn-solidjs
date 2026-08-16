import type { ComponentProps } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { Component } from "solid-js";

import { omit } from "solid-js";

const Empty: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");

  return (
    <div
      data-slot="empty"
      class={cn(
        "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 text-balance rounded-xl border-dashed p-6 text-center",
        props.class,
      )}
      {...others}
    />
  );
};

const EmptyHeader: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");

  return (
    <div
      data-slot="empty-header"
      class={cn(
        "flex max-w-sm flex-col items-center gap-2",
        props.class,
      )}
      {...others}
    />
  );
};

const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon:
          "flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const EmptyMedia: Component<
  ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>
> = (props) => {
  const others = omit(props, "class", "variant");
  return (
    <div
      data-slot="empty-icon"
      data-variant={props.variant ?? "default"}
      class={cn(
        emptyMediaVariants({
          variant: props.variant ?? "default",
          class: props.class,
        }),
      )}
      {...others}
    />
  );
};

const EmptyTitle: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="empty-title"
      class={cn("font-heading font-medium text-sm tracking-tight", props.class)}
      {...others}
    />
  );
};

const EmptyDescription: Component<ComponentProps<"p">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="empty-description"
      class={cn(
        "text-muted-foreground text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        props.class,
      )}
      {...others}
    />
  );
};

const EmptyContent: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="empty-content"
      class={cn(
        "flex w-full min-w-0 max-w-sm flex-col items-center gap-2.5 text-balance text-sm",
        props.class,
      )}
      {...others}
    />
  );
};

export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
};
