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

const NavigationMenuItem = NavigationMenuPrimitive.Menu;

const NavigationMenuViewportContext = createContext<() => boolean>(() => true);

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
