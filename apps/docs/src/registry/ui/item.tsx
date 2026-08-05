import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Polymorphic } from "@kobalte/core/polymorphic";

import type * as SeparatorPrimitive from "@kobalte/core/separator";
import { Separator } from "./separator.tsx";
import { cn } from "~/lib/utils.ts";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { Component, ComponentProps, ValidComponent } from "solid-js";

import { mergeProps, splitProps } from "solid-js";

const ItemGroup: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      role="list"
      data-slot="item-group"
      class={cn(
        "group/item-group flex w-full flex-col gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2",
        local.class,
      )}
      {...others}
    />
  );
};

type ItemSeparatorProps<T extends ValidComponent = "hr"> =
  & SeparatorPrimitive.SeparatorRootProps<T>
  & { class?: string | undefined };

const ItemSeparator = <T extends ValidComponent = "hr">(
  props: PolymorphicProps<T, ItemSeparatorProps<T>>,
) => {
  const [local, others] = splitProps(props as ItemSeparatorProps, ["class"]);
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      class={cn("my-2", local.class)}
      {...others}
    />
  );
};

const itemVariants = cva(
  "group/item flex w-full flex-wrap items-center rounded-lg border text-sm transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors [a]:hover:bg-muted",
  {
    variants: {
      variant: {
        default: "border-transparent",
        outline: "border-border",
        muted: "border-transparent bg-muted/50",
      },
      size: {
        default: "gap-2.5 px-3 py-2.5",
        sm: "gap-2.5 px-3 py-2.5",
        xs: "gap-2 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ItemProps<T extends ValidComponent = "div"> =
  & { as?: T; class?: string | undefined }
  & VariantProps<typeof itemVariants>;

const Item = <T extends ValidComponent = "div">(
  rawProps: PolymorphicProps<T, ItemProps<T>>,
) => {
  const props = mergeProps(
    { variant: "default" as const, size: "default" as const },
    rawProps,
  );
  const [local, others] = splitProps(props as ItemProps, [
    "class",
    "variant",
    "size",
  ]);
  return (
    <Polymorphic<ItemProps>
      as="div"
      data-slot="item"
      data-variant={local.variant}
      data-size={local.size}
      class={cn(
        itemVariants({ variant: local.variant, size: local.size }),
        local.class,
      )}
      {...others}
    />
  );
};

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "[&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type ItemMediaProps =
  & ComponentProps<"div">
  & VariantProps<typeof itemMediaVariants>;

const ItemMedia: Component<ItemMediaProps> = (rawProps) => {
  const props = mergeProps({ variant: "default" as const }, rawProps);
  const [local, others] = splitProps(props, ["class", "variant"]);
  return (
    <div
      data-slot="item-media"
      data-variant={local.variant}
      class={cn(
        itemMediaVariants({ variant: local.variant }),
        local.class,
      )}
      {...others}
    />
  );
};

const ItemContent: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="item-content"
      class={cn(
        "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none group-data-[size=xs]/item:gap-0",
        local.class,
      )}
      {...others}
    />
  );
};

const ItemTitle: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="item-title"
      class={cn(
        "line-clamp-1 flex w-fit items-center gap-2 font-medium text-sm leading-snug underline-offset-4",
        local.class,
      )}
      {...others}
    />
  );
};

const ItemDescription: Component<ComponentProps<"p">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <p
      data-slot="item-description"
      class={cn(
        "line-clamp-2 text-left font-normal text-muted-foreground text-sm leading-normal group-data-[size=xs]/item:text-xs",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        local.class,
      )}
      {...others}
    />
  );
};

const ItemActions: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="item-actions"
      class={cn("flex items-center gap-2", local.class)}
      {...others}
    />
  );
};

const ItemHeader: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="item-header"
      class={cn(
        "flex basis-full items-center justify-between gap-2",
        local.class,
      )}
      {...others}
    />
  );
};

const ItemFooter: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="item-footer"
      class={cn(
        "flex basis-full items-center justify-between gap-2",
        local.class,
      )}
      {...others}
    />
  );
};

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
};
