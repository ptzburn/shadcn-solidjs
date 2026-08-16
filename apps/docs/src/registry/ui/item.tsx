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
        "group/item-group flex w-full flex-col gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2",
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
        "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none group-data-[size=xs]/item:gap-0",
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
        "line-clamp-1 flex w-fit items-center gap-2 font-medium text-sm leading-snug underline-offset-4",
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
        "line-clamp-2 text-left font-normal text-muted-foreground text-sm leading-normal group-data-[size=xs]/item:text-xs",
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
      class={cn("flex items-center gap-2", props.class)}
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
        "flex basis-full items-center justify-between gap-2",
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
        "flex basis-full items-center justify-between gap-2",
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
