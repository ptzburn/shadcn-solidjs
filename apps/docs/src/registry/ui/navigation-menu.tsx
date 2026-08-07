import type { PolymorphicProps } from "@kobalte/core";
import * as NavigationMenuPrimitive from "@kobalte/core/navigation-menu";

import { cn } from "~/lib/utils.ts";
import { cva } from "class-variance-authority";
import type { JSX, ValidComponent } from "solid-js";

import { createContext, Show, splitProps, useContext } from "solid-js";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

// Kobalte folds Radix's `Root` and `List` into a single primitive: the root
// renders the `<nav>` wrapper and the `<ul>` itself, so there is no separate
// `NavigationMenuList`. It also has no `Item` element — `NavigationMenu.Menu`
// only provides context, and the `<li>` wrappers come from `Trigger`/`Link`.
const NavigationMenuItem = NavigationMenuPrimitive.Menu;

// Kobalte's `Portal` mounts a content into the viewport, so with
// `viewport={false}` the content has to render in place instead. The root
// publishes the flag for `NavigationMenuContent` to read.
const NavigationMenuViewportContext = createContext<() => boolean>(() => true);

type NavigationMenuProps<T extends ValidComponent = "ul"> =
  & NavigationMenuPrimitive.NavigationMenuRootProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
    viewport?: boolean;
  };

// Kobalte's popper centres the viewport on the menu bar; upstream's wrapper is
// `left-0`, so the placement is pinned to the start edge to match.
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
      placement="bottom-start"
      data-slot="navigation-menu"
      data-viewport={viewport()}
      class={cn(
        "cn-navigation-menu group/navigation-menu relative flex max-w-max flex-1 list-none items-center justify-center data-[orientation=vertical]:flex-col",
        local.class,
      )}
      {...others}
    >
      <NavigationMenuViewportContext.Provider value={viewport}>
        {local.children}
        <Show when={viewport()}>
          <NavigationMenuViewport />
        </Show>
      </NavigationMenuViewportContext.Provider>
    </NavigationMenuPrimitive.Root>
  );
};

const navigationMenuTriggerStyle = cva(
  "cn-navigation-menu-trigger group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center outline-none disabled:pointer-events-none",
);

type NavigationMenuTriggerProps<T extends ValidComponent = "button"> =
  & NavigationMenuPrimitive.NavigationMenuTriggerProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
  };

// Kobalte turns a trigger that carries an `href` into a plain menubar link —
// the keyboard-reachable stand-in for upstream's top-level `NavigationMenuLink`
// styled with `navigationMenuTriggerStyle()`. Such a trigger opens nothing, so
// it does not get the chevron, and the popup ARIA Kobalte puts on every trigger
// is cleared: Kobalte spreads incoming props last, so `null` wins over it.
const NavigationMenuTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, NavigationMenuTriggerProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuTriggerProps, [
    "class",
    "children",
  ]);
  const isLink = () => "href" in (props as Record<string, unknown>);
  const linkAria = {
    get "aria-haspopup"() {
      return isLink() ? null : undefined;
    },
    get "aria-expanded"() {
      return isLink() ? null : undefined;
    },
  } as Record<string, string | null | undefined>;
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      class={cn(navigationMenuTriggerStyle(), "group", local.class)}
      {...others}
      {...linkAria}
    >
      {local.children}{" "}
      <Show when={!isLink()}>
        <IconPlaceholder
          lucide="chevron-down"
          tabler="chevron-down"
          ph="caret-down"
          ri="arrow-down-s-line"
          hugeicons="arrow-down-01"
          class="cn-navigation-menu-trigger-icon"
          aria-hidden="true"
        />
      </Show>
    </NavigationMenuPrimitive.Trigger>
  );
};

type NavigationMenuContentProps<T extends ValidComponent = "ul"> =
  & NavigationMenuPrimitive.NavigationMenuContentProps<T>
  & {
    class?: string | undefined;
  };

// Kobalte portals the content into the viewport, which measures it to size
// itself — so the content is absolutely positioned rather than upstream's
// `md:absolute` (an in-flow content would feed its own measurement back and
// collapse to zero). Upstream's `w-full` below `md` is replaced by a cap at the
// popper's own available width, which keeps a wide content from pushing the
// panel past the edge of the screen without ever measuring zero. With
// `viewport={false}` there is no viewport to portal into, so the content
// renders in place.
const NavigationMenuContent = <T extends ValidComponent = "ul">(
  props: PolymorphicProps<T, NavigationMenuContentProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuContentProps, [
    "class",
  ]);
  const viewport = useContext(NavigationMenuViewportContext);
  const content = () => (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      class={cn(
        "cn-navigation-menu-content absolute top-0 left-0 group-data-[viewport=true]/navigation-menu:max-w-(--kb-popper-content-available-width) group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:z-50 group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:max-md:max-w-full **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        local.class,
      )}
      {...others}
    />
  );
  return (
    <Show when={viewport()} fallback={content()}>
      <NavigationMenuPrimitive.Portal>
        {content()}
      </NavigationMenuPrimitive.Portal>
    </Show>
  );
};

type NavigationMenuViewportProps<T extends ValidComponent = "li"> =
  & NavigationMenuPrimitive.NavigationMenuViewportProps<T>
  & { class?: string | undefined };

// Kobalte positions the viewport with its own popper, so upstream's absolutely
// positioned wrapper element is not needed; the offset comes from `gutter` and
// the wrapper's `z-50` moves onto the viewport itself.
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
        "cn-navigation-menu-viewport relative z-50 h-(--kb-navigation-menu-viewport-height) w-(--kb-navigation-menu-viewport-width) origin-(--kb-menu-content-transform-origin) overflow-hidden",
        local.class,
      )}
      {...others}
    />
  );
};

type NavigationMenuLinkProps<T extends ValidComponent = "a"> =
  & NavigationMenuPrimitive.NavigationMenuItemProps<T>
  & { class?: string | undefined };

// Kobalte's `Item` renders the `<li>` wrapper and the `<a>` for us, so the link
// is not wrapped in a list item by hand the way upstream does it.
const NavigationMenuLink = <T extends ValidComponent = "a">(
  props: PolymorphicProps<T, NavigationMenuLinkProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuLinkProps, [
    "class",
  ]);
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-link"
      class={cn("cn-navigation-menu-link", local.class)}
      {...others}
    />
  );
};

type NavigationMenuLabelProps<T extends ValidComponent = "div"> =
  & NavigationMenuPrimitive.NavigationMenuItemLabelProps<T>
  & { class?: string | undefined };

// Solid-only: Kobalte wires `ItemLabel`/`ItemDescription` to the link's
// `aria-labelledby`/`aria-describedby`. Upstream uses plain `div`s instead.
const NavigationMenuLabel = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, NavigationMenuLabelProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuLabelProps, [
    "class",
  ]);
  return (
    <NavigationMenuPrimitive.ItemLabel
      data-slot="navigation-menu-label"
      class={cn("cn-navigation-menu-label", local.class)}
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
    ["class"],
  );
  return (
    <NavigationMenuPrimitive.ItemDescription
      data-slot="navigation-menu-description"
      class={cn("cn-navigation-menu-description", local.class)}
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
