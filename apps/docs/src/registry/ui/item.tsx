import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Polymorphic } from "@kobalte/core/polymorphic";

import type * as SeparatorPrimitive from "@kobalte/core/separator";
import { cn } from "~/lib/utils.ts";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { Component, ComponentProps, ValidComponent } from "solid-js";
import { mergeProps, splitProps } from "solid-js";

import { Separator } from "./separator.tsx";

const ItemGroup: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      role="list"
      data-slot="item-group"
      class={cn(
        "cn-item-group group/item-group flex w-full flex-col",
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
      class={cn("cn-item-separator", local.class)}
      {...others}
    />
  );
};

const itemVariants = cva(
  "cn-item group/item flex w-full flex-wrap items-center transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors",
  {
    variants: {
      variant: {
        default: "cn-item-variant-default",
        outline: "cn-item-variant-outline",
        muted: "cn-item-variant-muted",
      },
      size: {
        default: "cn-item-size-default",
        sm: "cn-item-size-sm",
        xs: "cn-item-size-xs",
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
  "cn-item-media flex shrink-0 items-center justify-center [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "cn-item-media-variant-default",
        icon: "cn-item-media-variant-icon",
        image: "cn-item-media-variant-image",
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
        "cn-item-content flex flex-1 flex-col [&+[data-slot=item-content]]:flex-none",
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
        "cn-item-title line-clamp-1 flex w-fit items-center",
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
        "cn-item-description line-clamp-2 font-normal",
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
      class={cn("cn-item-actions flex items-center", local.class)}
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
        "cn-item-header flex basis-full items-center justify-between",
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
        "cn-item-footer flex basis-full items-center justify-between",
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
