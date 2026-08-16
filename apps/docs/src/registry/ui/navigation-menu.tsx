import * as NavigationMenuPrimitive from "@kobalte/core/navigation-menu";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { JSX, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { cva } from "class-variance-authority";

import {
  createContext,
  createEffect,
  createSignal,
  omit,
  Show,
  useContext,
} from "solid-js";

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
// `left-0`, so the placement is pinned to the start edge — on the axis Kobalte
// itself would pick for the orientation, so a vertical menu still opens sideways
// the way its `data-[orientation=vertical]:flex-col` bar expects.
//
// `viewport={false}` also has to be given its own dismissal. Kobalte wires
// `onEscapeKeyDown` only into the viewport's `DismissableLayer` and into the
// `Popper.Positioner` branch of `MenuContentBase`; with no viewport neither of
// them renders, so nothing but an outside click can close the menu. The root
// therefore takes over the open menu's value and closes it from a document-level
// `keydown` listener — the same place Kobalte's own dismissable layer listens —
// attached only while such a menu is open.
const NavigationMenu = <T extends ValidComponent = "ul">(
  props: PolymorphicProps<T, NavigationMenuProps<T>>,
) => {
  const local = props as NavigationMenuProps;
  const others = omit(
    local,
    "class",
    "children",
    "viewport",
    "value",
    "onValueChange",
  );
  const viewport = () => local.viewport ?? true;
  const orientation = () => local.orientation;
  const [openMenu, setOpenMenu] = createSignal<string | null>(
    local.defaultValue ?? null,
  );
  const value = () => local.value !== undefined ? local.value : openMenu();
  const onValueChange = (next: string | null | undefined) => {
    setOpenMenu(next ?? null);
    local.onValueChange?.(next);
  };
  createEffect(
    () => !viewport() && value() != null,
    (active) => {
      if (!active) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Escape") return;
        const content = (event.target as HTMLElement | null)?.closest(
          "[data-slot=navigation-menu-content]",
        );
        const trigger = document.getElementById(
          content?.getAttribute("aria-labelledby") ?? "",
        );
        onValueChange(null);
        trigger?.focus();
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    },
  );
  return (
    <NavigationMenuPrimitive.Root
      gutter={6}
      placement={orientation() === "vertical" ? "right-start" : "bottom-start"}
      data-slot="navigation-menu"
      data-viewport={viewport() ? "true" : "false"}
      value={viewport() ? undefined : value()}
      onValueChange={onValueChange}
      class={cn(
        "group/navigation-menu relative flex max-w-max flex-1 list-none items-center justify-center gap-0 data-[orientation=vertical]:flex-col",
        local.class,
      )}
      {...others}
    >
      <NavigationMenuViewportContext value={viewport}>
        {local.children}
        <Show when={viewport()}>
          <NavigationMenuViewport />
        </Show>
      </NavigationMenuViewportContext>
    </NavigationMenuPrimitive.Root>
  );
};

const navigationMenuTriggerStyle = cva(
  "hover:bg-muted focus:bg-muted data-expanded:hover:bg-muted data-expanded:focus:bg-muted data-expanded:bg-muted/50 focus-visible:ring-ring/50 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all focus-visible:ring-3 focus-visible:outline-1 disabled:opacity-50 group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center outline-none disabled:pointer-events-none",
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
  const local = props as NavigationMenuTriggerProps;
  const others = omit(local, "class", "children");
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
          class="relative top-px ml-1 size-3 transition duration-300 group-data-expanded/navigation-menu-trigger:rotate-180"
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

// Kobalte portals the content into the viewport, which sizes itself from the
// content's measured box, so the content is absolutely positioned at every width
// rather than only from `md` up the way upstream's is. Upstream's in-flow
// `w-full` below `md` cannot come with it: the viewport is absolutely positioned
// and shrink-to-fits, so a percentage width resolves against the content's own
// max-content size and the viewport then locks in at exactly that width —
// measured at 375px, a 404px content, a 404px
// `--kb-navigation-menu-viewport-width` and 37px of page overflow. A cap at the
// popper's own available width narrows the panel instead. With `viewport={false}`
// there is no viewport to portal into, so the content renders in place: `z-50`
// gives it the elevation the shared viewport carries here (neither port renders
// the viewport's wrapper in this mode), and `max-md:max-w-full` holds it to the
// width of the menu bar, which is its positioning container, since the popper
// variable is not published outside the popper.
const NavigationMenuContent = <T extends ValidComponent = "ul">(
  props: PolymorphicProps<T, NavigationMenuContentProps<T>>,
) => {
  const local = props as NavigationMenuContentProps;
  const others = omit(local, "class");
  const viewport = useContext(NavigationMenuViewportContext);
  const content = () => (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      class={cn(
        "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 group-data-[viewport=false]/navigation-menu:data-closed:fade-out-0 group-data-[viewport=false]/navigation-menu:data-closed:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-expanded:fade-in-0 group-data-[viewport=false]/navigation-menu:data-expanded:zoom-in-95 absolute top-0 left-0 p-1 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:z-50 group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=true]/navigation-menu:max-w-(--kb-popper-content-available-width) data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-lg group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:ring-foreground/10 group-data-[viewport=false]/navigation-menu:duration-300 group-data-[viewport=false]/navigation-menu:max-md:max-w-full group-data-[viewport=false]/navigation-menu:data-closed:animate-out group-data-[viewport=false]/navigation-menu:data-expanded:animate-in **:data-[slot=navigation-menu-link]:focus:outline-none **:data-[slot=navigation-menu-link]:focus:ring-0",
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
  const local = props as NavigationMenuViewportProps;
  const others = omit(local, "class");
  return (
    <NavigationMenuPrimitive.Viewport
      data-slot="navigation-menu-viewport"
      class={cn(
        "data-closed:zoom-out-90 data-expanded:zoom-in-90 relative z-50 h-(--kb-navigation-menu-viewport-height) w-(--kb-navigation-menu-viewport-width) origin-(--kb-menu-content-transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow ring-1 ring-foreground/10 duration-100 data-closed:animate-out data-expanded:animate-in",
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
  const local = props as NavigationMenuLinkProps;
  const others = omit(local, "class");
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-link"
      class={cn(
        "flex items-center gap-2 rounded-lg p-2 text-sm outline-none transition-all hover:bg-muted focus:bg-muted focus-visible:outline-1 focus-visible:ring-3 focus-visible:ring-ring/50 in-data-[slot=navigation-menu-content]:rounded-md data-active:bg-muted/50 data-active:hover:bg-muted data-active:focus:bg-muted [&_svg:not([class*='size-'])]:size-4",
        local.class,
      )}
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
  const local = props as NavigationMenuLabelProps;
  const others = omit(local, "class");
  return (
    <NavigationMenuPrimitive.ItemLabel
      data-slot="navigation-menu-label"
      class={cn(local.class)}
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
  const local = props as NavigationMenuDescriptionProps;
  const others = omit(local, "class");
  return (
    <NavigationMenuPrimitive.ItemDescription
      data-slot="navigation-menu-description"
      class={cn(local.class)}
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
