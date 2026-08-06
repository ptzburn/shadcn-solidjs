import { cn } from "~/lib/utils.ts";
import { cva, type VariantProps } from "class-variance-authority";

import { type Component, type ComponentProps, splitProps } from "solid-js";

const Empty: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <div
      data-slot="empty"
      class={cn(
        "cn-empty flex w-full min-w-0 flex-1 flex-col items-center justify-center text-balance text-center",
        local.class,
      )}
      {...others}
    />
  );
};

const EmptyHeader: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <div
      data-slot="empty-header"
      class={cn(
        "cn-empty-header flex max-w-sm flex-col items-center",
        local.class,
      )}
      {...others}
    />
  );
};

const emptyMediaVariants = cva(
  "cn-empty-media flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "cn-empty-media-default",
        icon: "cn-empty-media-icon",
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
  const [local, others] = splitProps(props, ["class", "variant"]);
  return (
    <div
      data-slot="empty-icon"
      data-variant={local.variant ?? "default"}
      class={cn(
        emptyMediaVariants({
          variant: local.variant ?? "default",
          class: local.class,
        }),
      )}
      {...others}
    />
  );
};

const EmptyTitle: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="empty-title"
      class={cn(
        "cn-empty-title font-heading",
        local.class,
      )}
      {...others}
    />
  );
};

const EmptyDescription: Component<ComponentProps<"p">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="empty-description"
      class={cn(
        "cn-empty-description text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        local.class,
      )}
      {...others}
    />
  );
};

const EmptyContent: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="empty-content"
      class={cn(
        "cn-empty-content flex w-full min-w-0 max-w-sm flex-col items-center text-balance",
        local.class,
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
