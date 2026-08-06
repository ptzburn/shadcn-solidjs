import type { PolymorphicProps } from "@kobalte/core";
import * as NavigationMenuPrimitive from "@kobalte/core/navigation-menu";

import { cn } from "~/lib/utils.ts";
import { cva } from "class-variance-authority";
import type { JSX, ValidComponent } from "solid-js";

import { Show, splitProps } from "solid-js";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

// Kobalte merges Radix's <Root> and <Item> into <Menu>; this is the item.
const NavigationMenuItem = NavigationMenuPrimitive.Menu;

type NavigationMenuProps<T extends ValidComponent = "ul"> =
  & NavigationMenuPrimitive.NavigationMenuRootProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
    viewport?: boolean;
  };

const NavigationMenu = <T extends ValidComponent = "ul">(
  props: PolymorphicProps<T, NavigationMenuProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuProps, [
    "class",
    "children",
    "viewport",
  ]);
  const viewport = () => local.viewport ?? true;
  return (
    <NavigationMenuPrimitive.Root
      gutter={6}
      data-slot="navigation-menu"
      data-viewport={viewport()}
      class={cn(
        "cn-navigation-menu group/navigation-menu relative flex max-w-max flex-1 list-none items-center justify-center gap-1 data-[orientation=vertical]:flex-col",
        local.class,
      )}
      {...others}
    >
      {local.children}
      <Show when={viewport()}>
        <NavigationMenuViewport />
      </Show>
    </NavigationMenuPrimitive.Root>
  );
};

const navigationMenuTriggerStyle = cva(
  "cn-navigation-menu-trigger group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 transition-[color,box-shadow] outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none data-expanded:bg-accent/50 data-expanded:text-accent-foreground data-expanded:hover:bg-accent data-expanded:focus:bg-accent",
);

type NavigationMenuTriggerProps<T extends ValidComponent = "button"> =
  & NavigationMenuPrimitive.NavigationMenuTriggerProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const NavigationMenuTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, NavigationMenuTriggerProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuTriggerProps, [
    "class",
    "children",
  ]);
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      class={cn(navigationMenuTriggerStyle(), "group", local.class)}
      {...others}
    >
      {local.children}{" "}
      <IconPlaceholder
        lucide="chevron-down"
        tabler="chevron-down"
        ph="caret-down"
        ri="arrow-down-s-line"
        hugeicons="arrow-down-01"
        class="cn-navigation-menu-trigger-icon"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
};

type NavigationMenuViewportProps<T extends ValidComponent = "li"> =
  & NavigationMenuPrimitive.NavigationMenuViewportProps<T>
  & { class?: string | undefined };

const NavigationMenuViewport = <T extends ValidComponent = "li">(
  props: PolymorphicProps<T, NavigationMenuViewportProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuViewportProps, [
    "class",
  ]);
  return (
    <NavigationMenuPrimitive.Viewport
      data-slot="navigation-menu-viewport"
      class={cn(
        // base settings
        "cn-navigation-menu-viewport pointer-events-none z-[1000] flex h-[var(--kb-navigation-menu-viewport-height)] w-[var(--kb-navigation-menu-viewport-width)] origin-[var(--kb-menu-content-transform-origin)] items-center justify-center overflow-x-clip overflow-y-visible rounded-md border opacity-0 shadow-lg data-[expanded]:pointer-events-auto data-[orientation=vertical]:overflow-y-clip data-[orientation=vertical]:overflow-x-visible data-[expanded]:rounded-md",
        // animate
        "animate-content-hide transition-[width,height] duration-200 ease-in data-[expanded]:animate-content-show data-[expanded]:opacity-100 data-[expanded]:ease-out",
        local.class,
      )}
      {...others}
    />
  );
};

type NavigationMenuContentProps<T extends ValidComponent = "ul"> =
  & NavigationMenuPrimitive.NavigationMenuContentProps<T>
  & {
    class?: string | undefined;
  };

const NavigationMenuContent = <T extends ValidComponent = "ul">(
  props: PolymorphicProps<T, NavigationMenuContentProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuContentProps, [
    "class",
  ]);
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Content
        data-slot="navigation-menu-content"
        class={cn(
          // base settings
          "cn-navigation-menu-content pointer-events-none absolute top-0 left-0 box-border p-4 focus:outline-none data-[expanded]:pointer-events-auto",
          // base animation settings
          "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out",
          // left to right
          "data-[orientation=horizontal]:data-[motion=from-start]:slide-in-from-left-52 data-[orientation=horizontal]:data-[motion=to-end]:slide-out-to-right-52",
          // right to left
          "data-[orientation=horizontal]:data-[motion=from-end]:slide-in-from-right-52 data-[orientation=horizontal]:data-[motion=to-start]:slide-out-to-left-52",
          // top to bottom
          "data-[orientation=vertical]:data-[motion=from-start]:slide-in-from-top-52 data-[orientation=vertical]:data-[motion=to-end]:slide-out-to-bottom-52",
          //bottom to top
          "data-[orientation=vertical]:data-[motion=from-end]:slide-in-from-bottom-52 data-[orientation=vertical]:data-[motion=to-start]:slide-out-to-bottom-52",
          "**:data-[slot=navigation-menu-link]:focus:outline-none **:data-[slot=navigation-menu-link]:focus:ring-0",
          local.class,
        )}
        {...others}
      />
    </NavigationMenuPrimitive.Portal>
  );
};

type NavigationMenuLinkProps<T extends ValidComponent = "a"> =
  & NavigationMenuPrimitive.NavigationMenuItemProps<T>
  & { class?: string | undefined };

const NavigationMenuLink = <T extends ValidComponent = "a">(
  props: PolymorphicProps<T, NavigationMenuLinkProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuLinkProps, [
    "class",
  ]);
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-link"
      class={cn(
        "cn-navigation-menu-link flex-col gap-1 rounded-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[current]:bg-accent/50 data-[current]:text-accent-foreground data-[current]:hover:bg-accent data-[current]:focus:bg-accent [&_svg:not([class*='text-'])]:text-muted-foreground",
        local.class,
      )}
      {...others}
    />
  );
};

type NavigationMenuLabelProps<T extends ValidComponent = "div"> =
  & NavigationMenuPrimitive.NavigationMenuItemLabelProps<T>
  & { class?: string | undefined };

const NavigationMenuLabel = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, NavigationMenuLabelProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuLabelProps, [
    "class",
  ]);
  return (
    <NavigationMenuPrimitive.ItemLabel
      data-slot="navigation-menu-label"
      class={cn("font-medium text-sm leading-none", local.class)}
      {...others}
    />
  );
};

type NavigationMenuDescriptionProps<T extends ValidComponent = "div"> =
  & NavigationMenuPrimitive.NavigationMenuItemDescriptionProps<T>
  & { class?: string | undefined };

const NavigationMenuDescription = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, NavigationMenuDescriptionProps<T>>,
) => {
  const [local, others] = splitProps(
    props as NavigationMenuDescriptionProps,
    [
      "class",
    ],
  );
  return (
    <NavigationMenuPrimitive.ItemDescription
      data-slot="navigation-menu-description"
      class={cn(
        "text-muted-foreground text-sm leading-snug",
        local.class,
      )}
      {...others}
    />
  );
};

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuDescription,
  NavigationMenuItem,
  NavigationMenuLabel,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
};
