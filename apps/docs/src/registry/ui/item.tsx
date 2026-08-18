import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Polymorphic } from "@kobalte/core/polymorphic";

import type * as SeparatorPrimitive from "@kobalte/core/separator";
import type { ComponentProps, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { Component } from "solid-js";
import { merge, omit } from "solid-js";

import { Separator } from "./separator.tsx";

const ItemGroup: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      role="list"
      data-slot="item-group"
      class={cn(
        "cn-item-group group/item-group flex w-full flex-col",
        props.class,
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
  const local = props as ItemSeparatorProps;
  const others = omit(local, "class");
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
  const props = merge(
    { variant: "default" as const, size: "default" as const },
    rawProps as ItemProps,
  );
  const others = omit(props, "class", "variant", "size");
  return (
    <Polymorphic<ItemProps>
      as="div"
      data-slot="item"
      data-variant={props.variant}
      data-size={props.size}
      class={cn(
        itemVariants({ variant: props.variant, size: props.size }),
        props.class,
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
  const props = merge({ variant: "default" as const }, rawProps);
  const others = omit(props, "class", "variant");
  return (
    <div
      data-slot="item-media"
      data-variant={props.variant}
      class={cn(
        itemMediaVariants({ variant: props.variant }),
        props.class,
      )}
      {...others}
    />
  );
};

const ItemContent: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="item-content"
      class={cn(
        "cn-item-content flex flex-1 flex-col [&+[data-slot=item-content]]:flex-none",
        props.class,
      )}
      {...others}
    />
  );
};

const ItemTitle: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="item-title"
      class={cn(
        "cn-item-title line-clamp-1 flex w-fit items-center",
        props.class,
      )}
      {...others}
    />
  );
};

const ItemDescription: Component<ComponentProps<"p">> = (props) => {
  const others = omit(props, "class");
  return (
    <p
      data-slot="item-description"
      class={cn(
        "cn-item-description line-clamp-2 font-normal",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        props.class,
      )}
      {...others}
    />
  );
};

const ItemActions: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="item-actions"
      class={cn("cn-item-actions flex items-center", props.class)}
      {...others}
    />
  );
};

const ItemHeader: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="item-header"
      class={cn(
        "cn-item-header flex basis-full items-center justify-between",
        props.class,
      )}
      {...others}
    />
  );
};

const ItemFooter: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="item-footer"
      class={cn(
        "cn-item-footer flex basis-full items-center justify-between",
        props.class,
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
