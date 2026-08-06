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
        "cn-drawer-overlay fixed inset-0 z-50 data-transitioning:transition-colors data-transitioning:duration-300",
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
          "cn-drawer-content group/drawer-content fixed z-50 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:mt-24 data-[side=bottom]:max-h-[80vh] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:w-3/4 data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:w-3/4 data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:mb-24 data-[side=top]:max-h-[80vh] data-transitioning:transition-transform data-transitioning:duration-300 data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
          props.class,
        )}
        {...rest}
      >
        <div class="cn-drawer-handle mx-auto hidden shrink-0 group-data-[side=bottom]/drawer-content:block" />
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
        "cn-drawer-header flex flex-col group-data-[side=bottom]/drawer-content:text-center group-data-[side=top]/drawer-content:text-center",
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
      class={cn("cn-drawer-footer mt-auto flex flex-col", props.class)}
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
        "cn-drawer-title font-heading",
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
      class={cn("cn-drawer-description", props.class)}
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
