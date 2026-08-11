import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as TabsPrimitive from "@kobalte/core/tabs";

import { cn } from "~/lib/utils.ts";
import { cva, type VariantProps } from "class-variance-authority";
import type { ValidComponent } from "solid-js";

import { mergeProps, splitProps } from "solid-js";

type TabsProps<T extends ValidComponent = "div"> =
  & TabsPrimitive.TabsRootProps<T>
  & { class?: string | undefined };

const Tabs = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, TabsProps<T>>,
) => {
  const [local, others] = splitProps(props as TabsProps, ["class"]);
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      class={cn(
        "cn-tabs group/tabs flex data-[orientation=horizontal]:flex-col",
        local.class,
      )}
      {...others}
    />
  );
};

const tabsListVariants = cva(
  // relative so the Kobalte-only indicator, which is absolute, resolves its
  // edge pins against the list rather than a distant positioned ancestor
  "cn-tabs-list group/tabs-list relative inline-flex w-fit items-center justify-center text-muted-foreground group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "cn-tabs-list-variant-default bg-muted",
        line: "cn-tabs-list-variant-line gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type TabsListProps<T extends ValidComponent = "div"> =
  & TabsPrimitive.TabsListProps<T>
  & VariantProps<typeof tabsListVariants>
  & { class?: string | undefined };

const TabsList = <T extends ValidComponent = "div">(
  rawProps: PolymorphicProps<T, TabsListProps<T>>,
) => {
  const props = mergeProps(
    { variant: "default" as const },
    rawProps as TabsListProps,
  );
  const [local, others] = splitProps(props, ["class", "variant"]);
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={local.variant}
      class={cn(tabsListVariants({ variant: local.variant }), local.class)}
      {...others}
    />
  );
};

type TabsTriggerProps<T extends ValidComponent = "button"> =
  & TabsPrimitive.TabsTriggerProps<T>
  & { class?: string | undefined };

const TabsTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, TabsTriggerProps<T>>,
) => {
  const [local, others] = splitProps(props as TabsTriggerProps, ["class"]);
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      class={cn(
        "cn-tabs-trigger relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center whitespace-nowrap text-foreground/60 transition-all hover:text-foreground focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none data-disabled:pointer-events-none group-data-[orientation=vertical]/tabs:w-full [&_svg]:shrink-0 group-data-[orientation=vertical]/tabs:justify-start data-disabled:opacity-50",
        "dark:group-data-[variant=line]/tabs-list:data-selected:border-transparent dark:group-data-[variant=line]/tabs-list:data-selected:bg-transparent group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-selected:bg-transparent",
        "dark:data-selected:border-input dark:data-selected:bg-input/30 dark:data-selected:text-foreground data-selected:bg-background data-selected:text-foreground",
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-selected:after:opacity-100",
        local.class,
      )}
      {...others}
    />
  );
};

type TabsContentProps<T extends ValidComponent = "div"> =
  & TabsPrimitive.TabsContentProps<T>
  & { class?: string | undefined };

const TabsContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, TabsContentProps<T>>,
) => {
  const [local, others] = splitProps(props as TabsContentProps, ["class"]);
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      class={cn("cn-tabs-content flex-1 outline-none", local.class)}
      {...others}
    />
  );
};

type TabsIndicatorProps<T extends ValidComponent = "div"> =
  & TabsPrimitive.TabsIndicatorProps<T>
  & { class?: string | undefined };

const TabsIndicator = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, TabsIndicatorProps<T>>,
) => {
  const [local, others] = splitProps(props as TabsIndicatorProps, ["class"]);
  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      class={cn(
        "cn-tabs-indicator absolute transition-all duration-250 data-[orientation=vertical]:top-0 data-[orientation=vertical]:-right-px data-[orientation=horizontal]:-bottom-px data-[orientation=horizontal]:left-0 data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-0.5",
        local.class,
      )}
      {...others}
    />
  );
};

export {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  tabsListVariants,
  TabsTrigger,
};
