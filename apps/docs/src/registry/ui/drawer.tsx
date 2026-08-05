import type {
  CloseProps,
  ContentProps,
  DescriptionProps,
  DynamicProps,
  LabelProps,
  OverlayProps,
  TriggerProps,
} from "@corvu/drawer";
import DrawerPrimitive from "@corvu/drawer";

import { cn } from "~/lib/utils.ts";
import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js";

import { splitProps } from "solid-js";

const Drawer = DrawerPrimitive;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerTrigger = <T extends ValidComponent = "button">(
  props: DynamicProps<T, TriggerProps<T>>,
) => {
  return (
    <DrawerPrimitive.Trigger
      data-slot="drawer-trigger"
      {...(props as TriggerProps)}
    />
  );
};

const DrawerClose = <T extends ValidComponent = "button">(
  props: DynamicProps<T, CloseProps<T>>,
) => {
  return (
    <DrawerPrimitive.Close
      data-slot="drawer-close"
      {...(props as CloseProps)}
    />
  );
};

type DrawerOverlayProps<T extends ValidComponent = "div"> = OverlayProps<T> & {
  class?: string;
};

const DrawerOverlay = <T extends ValidComponent = "div">(
  props: DynamicProps<T, DrawerOverlayProps<T>>,
) => {
  const [, rest] = splitProps(props as DrawerOverlayProps, ["class"]);
  const drawerContext = DrawerPrimitive.useContext();
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      class={cn(
        "fixed inset-0 z-50 supports-backdrop-filter:backdrop-blur-xs data-transitioning:transition-colors data-transitioning:duration-300",
        props.class,
      )}
      style={{
        "background-color": `rgb(0 0 0 / ${
          0.1 * drawerContext.openPercentage()
        })`,
      }}
      {...rest}
    />
  );
};

type DrawerContentProps<T extends ValidComponent = "div"> = ContentProps<T> & {
  class?: string;
  children?: JSX.Element;
};

const DrawerContent = <T extends ValidComponent = "div">(
  props: DynamicProps<T, DrawerContentProps<T>>,
) => {
  const [, rest] = splitProps(props as DrawerContentProps, [
    "class",
    "children",
  ]);
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        class={cn(
          "group/drawer-content fixed z-50 flex h-auto flex-col bg-popover text-popover-foreground text-sm data-[side=bottom]:inset-x-0 data-[side=left]:inset-y-0 data-[side=right]:inset-y-0 data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=right]:right-0 data-[side=bottom]:bottom-0 data-[side=left]:left-0 data-[side=bottom]:mt-24 data-[side=top]:mb-24 data-[side=bottom]:max-h-[80vh] data-[side=top]:max-h-[80vh] data-[side=left]:w-3/4 data-[side=right]:w-3/4 data-[side=bottom]:rounded-t-xl data-[side=left]:rounded-r-xl data-[side=right]:rounded-l-xl data-[side=top]:rounded-b-xl data-[side=bottom]:border-t data-[side=left]:border-r data-[side=right]:border-l data-[side=top]:border-b data-transitioning:transition-transform data-transitioning:duration-300 data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
          props.class,
        )}
        {...rest}
      >
        <div class="mx-auto mt-4 hidden h-1 w-[100px] shrink-0 rounded-full bg-muted group-data-[side=bottom]/drawer-content:block" />
        {props.children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
};

const DrawerHeader: Component<ComponentProps<"div">> = (props) => {
  const [, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="drawer-header"
      class={cn(
        "flex flex-col gap-0.5 p-4 md:gap-0.5 md:text-left group-data-[side=bottom]/drawer-content:text-center group-data-[side=top]/drawer-content:text-center",
        props.class,
      )}
      {...rest}
    />
  );
};

const DrawerFooter: Component<ComponentProps<"div">> = (props) => {
  const [, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="drawer-footer"
      class={cn("mt-auto flex flex-col gap-2 p-4", props.class)}
      {...rest}
    />
  );
};

type DrawerTitleProps<T extends ValidComponent = "div"> = LabelProps<T> & {
  class?: string;
};

const DrawerTitle = <T extends ValidComponent = "div">(
  props: DynamicProps<T, DrawerTitleProps<T>>,
) => {
  const [, rest] = splitProps(props as DrawerTitleProps, ["class"]);
  return (
    <DrawerPrimitive.Label
      data-slot="drawer-title"
      class={cn(
        "font-heading font-medium text-base text-foreground",
        props.class,
      )}
      {...rest}
    />
  );
};

type DrawerDescriptionProps<T extends ValidComponent = "div"> =
  & DescriptionProps<T>
  & {
    class?: string;
  };

const DrawerDescription = <T extends ValidComponent = "div">(
  props: DynamicProps<T, DrawerDescriptionProps<T>>,
) => {
  const [, rest] = splitProps(props as DrawerDescriptionProps, ["class"]);
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      class={cn("text-muted-foreground text-sm", props.class)}
      {...rest}
    />
  );
};

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
