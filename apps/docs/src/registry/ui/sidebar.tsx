import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Polymorphic } from "@kobalte/core/polymorphic";
import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web";
import { getRequestEvent, isServer } from "@solidjs/web";
import { useMediaQuery } from "~/lib/hooks/use-media-query.ts";
import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { Accessor, Component } from "solid-js";

import {
  createContext,
  createEffect,
  createSignal,
  Match,
  merge,
  omit,
  Show,
  Switch,
  useContext,
} from "solid-js";
import type { ButtonProps } from "./button.tsx";
import { Button } from "./button.tsx";
import { Input } from "./input.tsx";
import { Separator } from "./separator.tsx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./sheet.tsx";
import { Skeleton } from "./skeleton.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip.tsx";

const MOBILE_BREAKPOINT = 768;
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContextProps = {
  state: Accessor<"expanded" | "collapsed">;
  open: Accessor<boolean>;
  setOpen: (open: boolean) => void;
  openMobile: Accessor<boolean>;
  setOpenMobile: (open: boolean) => void;
  isMobile: Accessor<boolean>;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextProps | null>(null);

function useSidebar(): SidebarContextProps {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

function readSidebarOpenCookie(): boolean | undefined {
  const cookieString = isServer
    ? getRequestEvent()?.request.headers.get("cookie") ?? ""
    : (typeof document !== "undefined" ? document.cookie : "");

  const value = cookieString
    .split("; ")
    .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
    ?.split("=")[1];

  return value === undefined ? undefined : value === "true";
}

type SidebarProviderProps = Omit<ComponentProps<"div">, "style"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  style?: JSX.CSSProperties;
};

const SidebarProvider: Component<SidebarProviderProps> = (rawProps) => {
  const props = merge({ defaultOpen: true }, rawProps);
  const others = omit(
    props,
    "defaultOpen",
    "open",
    "onOpenChange",
    "class",
    "style",
    "children",
  );

  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  const [openMobile, setOpenMobile] = createSignal(false);

  const [_open, _setOpen] = createSignal(
    readSidebarOpenCookie() ?? props.defaultOpen,
  );
  const open = () => props.open ?? _open();
  const setOpen = (value: boolean | ((value: boolean) => boolean)) => {
    const openState = typeof value === "function" ? value(open()) : value;
    if (props.onOpenChange) {
      props.onOpenChange(openState);
    } else {
      _setOpen(openState);
    }

    if (typeof document !== "undefined") {
      document.cookie =
        `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    }
  };

  const toggleSidebar = () => {
    return isMobile()
      ? setOpenMobile((open) => !open)
      : setOpen((open) => !open);
  };

  createEffect(() => {}, () => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  });

  const state = () => (open() ? "expanded" : "collapsed");

  const contextValue: SidebarContextProps = {
    state,
    open,
    setOpen,
    isMobile,
    openMobile,
    setOpenMobile,
    toggleSidebar,
  };

  return (
    <SidebarContext value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={{
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...props.style,
        }}
        class={cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar",
          props.class,
        )}
        {...others}
      >
        {props.children}
      </div>
    </SidebarContext>
  );
};

type SidebarProps = ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
};

const Sidebar: Component<SidebarProps> = (rawProps) => {
  const props = merge(
    {
      side: "left" as const,
      variant: "sidebar" as const,
      collapsible: "offcanvas" as const,
    },
    rawProps,
  );
  const others = omit(
    props,
    "side",
    "variant",
    "collapsible",
    "class",
    "children",
  );

  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  return (
    <Switch>
      <Match when={props.collapsible === "none"}>
        <div
          data-slot="sidebar"
          class={cn(
            "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
            props.class,
          )}
          {...others}
        >
          {props.children}
        </div>
      </Match>
      <Match when={isMobile()}>
        <Sheet
          open={openMobile()}
          onOpenChange={setOpenMobile}
          {...(others as ComponentProps<typeof Sheet>)}
        >
          <SheetContent
            data-sidebar="sidebar"
            data-slot="sidebar"
            data-mobile="true"
            class="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground"
            style={{
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            }}
            side={props.side}
            showCloseButton={false}
          >
            <SheetHeader class="sr-only">
              <SheetTitle>Sidebar</SheetTitle>
              <SheetDescription>Displays the mobile sidebar.</SheetDescription>
            </SheetHeader>
            <div class="flex h-full w-full flex-col">{props.children}</div>
          </SheetContent>
        </Sheet>
      </Match>
      <Match when={!isMobile()}>
        <div
          class="group peer hidden text-sidebar-foreground md:block"
          data-state={state()}
          data-collapsible={state() === "collapsed" ? props.collapsible : ""}
          data-variant={props.variant}
          data-side={props.side}
          data-slot="sidebar"
        >
          <div
            data-slot="sidebar-gap"
            class={cn(
              "cn-sidebar-gap relative w-(--sidebar-width) bg-transparent",
              "group-data-[collapsible=offcanvas]:w-0",
              "group-data-[side=right]:rotate-180",
              props.variant === "floating" || props.variant === "inset"
                ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
                : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
            )}
          />
          <div
            data-slot="sidebar-container"
            data-side={props.side}
            class={cn(
              "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex data-[side=right]:right-0 data-[side=left]:left-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]",
              props.variant === "floating" || props.variant === "inset"
                ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
                : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
              props.class,
            )}
            {...others}
          >
            <div
              data-sidebar="sidebar"
              data-slot="sidebar-inner"
              class="cn-sidebar-inner flex size-full flex-col"
            >
              {props.children}
            </div>
          </div>
        </div>
      </Match>
    </Switch>
  );
};

type SidebarTriggerProps<T extends ValidComponent = "button"> =
  & ButtonProps<T>
  & {
    onClick?: (event: MouseEvent) => void;
  };

const SidebarTrigger = <T extends ValidComponent = "button">(
  props: SidebarTriggerProps<T>,
) => {
  const local = props as SidebarTriggerProps;
  const others = omit(local, "class", "onClick");
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      class={cn("cn-sidebar-trigger", local.class)}
      onClick={(event: MouseEvent) => {
        local.onClick?.(event);
        toggleSidebar();
      }}
      {...others}
    >
      <IconPlaceholder
        lucide="panel-left"
        tabler="layout-sidebar"
        ph="sidebar"
        ri="side-bar-line"
        hugeicons="panel-left"
        class="cn-rtl-flip"
      />
      <span class="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

const SidebarRail: Component<ComponentProps<"button">> = (props) => {
  const others = omit(props, "class");
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabindex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      class={cn(
        "cn-sidebar-rail absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] sm:flex group-data-[side=left]:-right-4 group-data-[side=right]:left-0",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        props.class,
      )}
      {...others}
    />
  );
};

const SidebarInset: Component<ComponentProps<"main">> = (props) => {
  const others = omit(props, "class");
  return (
    <main
      data-slot="sidebar-inset"
      class={cn(
        "cn-sidebar-inset relative flex w-full flex-1 flex-col",
        props.class,
      )}
      {...others}
    />
  );
};

const SidebarInput: Component<ComponentProps<"input">> = (props) => {
  const others = omit(props, "class");
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      class={cn("cn-sidebar-input", props.class)}
      {...others}
    />
  );
};

const SidebarHeader: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      class={cn("cn-sidebar-header flex flex-col", props.class)}
      {...others}
    />
  );
};

const SidebarFooter: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      class={cn("cn-sidebar-footer flex flex-col", props.class)}
      {...others}
    />
  );
};

type SidebarSeparatorProps<T extends ValidComponent = "hr"> = ComponentProps<
  typeof Separator<T>
>;

const SidebarSeparator = <T extends ValidComponent = "hr">(
  props: SidebarSeparatorProps<T>,
) => {
  const local = props as SidebarSeparatorProps;
  const others = omit(local, "class");
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      class={cn("cn-sidebar-separator w-auto", local.class)}
      {...others}
    />
  );
};

const SidebarContent: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      class={cn(
        "cn-sidebar-content flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        props.class,
      )}
      {...others}
    />
  );
};

const SidebarGroup: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      class={cn(
        "cn-sidebar-group relative flex w-full min-w-0 flex-col",
        props.class,
      )}
      {...others}
    />
  );
};

type SidebarGroupLabelProps<T extends ValidComponent = "div"> = ComponentProps<
  T
>;

const SidebarGroupLabel = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SidebarGroupLabelProps<T>>,
) => {
  const local = props as SidebarGroupLabelProps;
  const others = omit(local, "class");

  return (
    <Polymorphic<SidebarGroupLabelProps>
      as="div"
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      class={cn(
        "cn-sidebar-group-label flex shrink-0 items-center outline-hidden [&>svg]:shrink-0",
        local.class,
      )}
      {...others}
    />
  );
};

type SidebarGroupActionProps<T extends ValidComponent = "button"> =
  ComponentProps<T>;

const SidebarGroupAction = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, SidebarGroupActionProps<T>>,
) => {
  const local = props as SidebarGroupActionProps;
  const others = omit(local, "class");
  return (
    <Polymorphic<SidebarGroupActionProps>
      as="button"
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      class={cn(
        "cn-sidebar-group-action flex aspect-square items-center justify-center outline-hidden transition-transform after:absolute after:-inset-2 md:after:hidden group-data-[collapsible=icon]:hidden [&>svg]:shrink-0",
        local.class,
      )}
      {...others}
    />
  );
};

const SidebarGroupContent: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      class={cn("cn-sidebar-group-content w-full", props.class)}
      {...others}
    />
  );
};

const SidebarMenu: Component<ComponentProps<"ul">> = (props) => {
  const others = omit(props, "class");
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      class={cn("cn-sidebar-menu flex w-full min-w-0 flex-col", props.class)}
      {...others}
    />
  );
};

const SidebarMenuItem: Component<ComponentProps<"li">> = (props) => {
  const others = omit(props, "class");
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      class={cn("group/menu-item relative", props.class)}
      {...others}
    />
  );
};

const sidebarMenuButtonVariants = cva(
  "cn-sidebar-menu-button peer/menu-button group/menu-button flex w-full items-center overflow-hidden outline-hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate",
  {
    variants: {
      variant: {
        default: "cn-sidebar-menu-button-variant-default",
        outline: "cn-sidebar-menu-button-variant-outline",
      },
      size: {
        default: "cn-sidebar-menu-button-size-default",
        sm: "cn-sidebar-menu-button-size-sm",
        lg: "cn-sidebar-menu-button-size-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type SidebarMenuButtonTooltipProps = Parameters<
  typeof TooltipContent<"div">
>[0];

type SidebarMenuButtonProps<T extends ValidComponent = "button"> =
  & ComponentProps<T>
  & VariantProps<typeof sidebarMenuButtonVariants>
  & {
    isActive?: boolean;
    tooltip?: string | SidebarMenuButtonTooltipProps;
  };

const SidebarMenuButton = <T extends ValidComponent = "button">(
  rawProps: PolymorphicProps<T, SidebarMenuButtonProps<T>>,
) => {
  const props = merge({
    isActive: false,
    variant: "default" as const,
    size: "default" as const,
  }, rawProps as SidebarMenuButtonProps);
  const others = omit(props, "isActive", "tooltip", "variant", "size", "class");
  const { isMobile, state } = useSidebar();

  const buttonProps = {
    "data-slot": "sidebar-menu-button",
    "data-sidebar": "menu-button",
    get "data-size"() {
      return props.size;
    },
    get "data-active"() {
      return props.isActive ? "true" : undefined;
    },
    get class() {
      return cn(
        sidebarMenuButtonVariants({ variant: props.variant, size: props.size }),
        props.class,
      );
    },
  };

  const tooltipProps = (): SidebarMenuButtonTooltipProps =>
    typeof props.tooltip === "string"
      ? { children: props.tooltip }
      : (props.tooltip ?? {});

  return (
    <Show
      when={props.tooltip}
      fallback={
        <Polymorphic<SidebarMenuButtonProps>
          as="button"
          {...buttonProps}
          {...others}
        />
      }
    >
      <Tooltip
        placement="right"
        disabled={state() !== "collapsed" || isMobile()}
      >
        <TooltipTrigger as="button" {...buttonProps} {...others} />
        <TooltipContent
          hidden={state() !== "collapsed" || isMobile()}
          {...tooltipProps()}
        />
      </Tooltip>
    </Show>
  );
};

type SidebarMenuActionProps<T extends ValidComponent = "button"> =
  & ComponentProps<T>
  & {
    showOnHover?: boolean;
  };

const SidebarMenuAction = <T extends ValidComponent = "button">(
  rawProps: PolymorphicProps<T, SidebarMenuActionProps<T>>,
) => {
  const props = merge(
    { showOnHover: false },
    rawProps as SidebarMenuActionProps,
  );
  const others = omit(props, "class", "showOnHover");

  return (
    <Polymorphic<SidebarMenuActionProps>
      as="button"
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      class={cn(
        "cn-sidebar-menu-action flex items-center justify-center outline-hidden transition-transform after:absolute after:-inset-2 md:after:hidden group-data-[collapsible=icon]:hidden [&>svg]:shrink-0",
        props.showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0",
        props.class,
      )}
      {...others}
    />
  );
};

const SidebarMenuBadge: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      class={cn(
        "cn-sidebar-menu-badge flex select-none items-center justify-center tabular-nums group-data-[collapsible=icon]:hidden",
        props.class,
      )}
      {...others}
    />
  );
};

type SidebarMenuSkeletonProps = ComponentProps<"div"> & {
  showIcon?: boolean;
};

const SidebarMenuSkeleton: Component<SidebarMenuSkeletonProps> = (rawProps) => {
  const props = merge({ showIcon: false }, rawProps);
  const others = omit(props, "class", "showIcon");

  const width = `${Math.floor(Math.random() * 40) + 50}%`;

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      class={cn("cn-sidebar-menu-skeleton flex items-center", props.class)}
      {...others}
    >
      <Show when={props.showIcon}>
        <Skeleton
          class="cn-sidebar-menu-skeleton-icon"
          data-sidebar="menu-skeleton-icon"
        />
      </Show>
      <Skeleton
        class="cn-sidebar-menu-skeleton-text max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={{
          "--skeleton-width": width,
        }}
      />
    </div>
  );
};

const SidebarMenuSub: Component<ComponentProps<"ul">> = (props) => {
  const others = omit(props, "class");
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      class={cn(
        "cn-sidebar-menu-sub flex min-w-0 flex-col group-data-[collapsible=icon]:hidden",
        props.class,
      )}
      {...others}
    />
  );
};

const SidebarMenuSubItem: Component<ComponentProps<"li">> = (props) => {
  const others = omit(props, "class");
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      class={cn("group/menu-sub-item relative", props.class)}
      {...others}
    />
  );
};

type SidebarMenuSubButtonProps<T extends ValidComponent = "a"> =
  & ComponentProps<T>
  & {
    size?: "sm" | "md";
    isActive?: boolean;
  };

const SidebarMenuSubButton = <T extends ValidComponent = "a">(
  rawProps: PolymorphicProps<T, SidebarMenuSubButtonProps<T>>,
) => {
  const props = merge(
    { size: "md" as const, isActive: false },
    rawProps as SidebarMenuSubButtonProps,
  );
  const others = omit(props, "size", "isActive", "class");

  return (
    <Polymorphic<SidebarMenuSubButtonProps>
      as="a"
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={props.size}
      data-active={props.isActive ? "true" : undefined}
      class={cn(
        "cn-sidebar-menu-sub-button flex min-w-0 -translate-x-px items-center overflow-hidden outline-hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 group-data-[collapsible=icon]:hidden [&>svg]:shrink-0 [&>span:last-child]:truncate",
        props.class,
      )}
      {...others}
    />
  );
};

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
