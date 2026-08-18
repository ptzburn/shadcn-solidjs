import * as DrawerPrimitive from "@kobalte/core/drawer";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { Component } from "solid-js";

import { omit } from "solid-js";

const Drawer = DrawerPrimitive.Root;
const DrawerPortal = DrawerPrimitive.Portal;

type DrawerTriggerProps<T extends ValidComponent = "button"> =
  & DrawerPrimitive.DrawerTriggerProps<T>
  & { class?: string | undefined };

const DrawerTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, DrawerTriggerProps<T>>,
) => {
  return (
    <DrawerPrimitive.Trigger
      data-slot="drawer-trigger"
      {...(props as DrawerTriggerProps)}
    />
  );
};

type DrawerCloseProps<T extends ValidComponent = "button"> =
  & DrawerPrimitive.DrawerCloseButtonProps<T>
  & { class?: string | undefined };

const DrawerClose = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, DrawerCloseProps<T>>,
) => {
  return (
    <DrawerPrimitive.CloseButton
      data-slot="drawer-close"
      {...(props as DrawerCloseProps)}
    />
  );
};

type DrawerOverlayProps<T extends ValidComponent = "div"> =
  & DrawerPrimitive.DrawerOverlayProps<T>
  & { class?: string | undefined };

const DrawerOverlay = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DrawerOverlayProps<T>>,
) => {
  const local = props as DrawerOverlayProps;
  const rest = omit(local, "class");
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      class={cn(
        "cn-drawer-overlay fixed inset-0 z-50 data-transitioning:transition-opacity data-transitioning:duration-300",
        local.class,
      )}
      {...rest}
    />
  );
};

type DrawerContentProps<T extends ValidComponent = "div"> =
  & DrawerPrimitive.DrawerContentProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const DrawerContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DrawerContentProps<T>>,
) => {
  const local = props as DrawerContentProps;
  const rest = omit(local, "class", "children");
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        class={cn(
          "cn-drawer-content group/drawer-content fixed z-50 data-[side=bottom]:inset-x-0 data-[side=left]:inset-y-0 data-[side=right]:inset-y-0 data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=right]:right-0 data-[side=bottom]:bottom-0 data-[side=left]:left-0 data-[side=bottom]:mt-24 data-[side=top]:mb-24 data-[side=bottom]:max-h-[80vh] data-[side=top]:max-h-[80vh] data-[side=left]:w-3/4 data-[side=right]:w-3/4 data-transitioning:transition-transform data-transitioning:duration-300 data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
          local.class,
        )}
        {...rest}
      >
        <div class="cn-drawer-handle mx-auto hidden shrink-0 group-data-[side=bottom]/drawer-content:block" />
        {local.children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
};

const DrawerHeader: Component<ComponentProps<"div">> = (props) => {
  const rest = omit(props, "class");
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
  const rest = omit(props, "class");
  return (
    <div
      data-slot="drawer-footer"
      class={cn("cn-drawer-footer mt-auto flex flex-col", props.class)}
      {...rest}
    />
  );
};

type DrawerTitleProps<T extends ValidComponent = "h2"> =
  & DrawerPrimitive.DrawerTitleProps<T>
  & { class?: string | undefined };

const DrawerTitle = <T extends ValidComponent = "h2">(
  props: PolymorphicProps<T, DrawerTitleProps<T>>,
) => {
  const local = props as DrawerTitleProps;
  const rest = omit(local, "class");
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      class={cn(
        "cn-drawer-title font-heading",
        local.class,
      )}
      {...rest}
    />
  );
};

type DrawerDescriptionProps<T extends ValidComponent = "p"> =
  & DrawerPrimitive.DrawerDescriptionProps<T>
  & { class?: string | undefined };

const DrawerDescription = <T extends ValidComponent = "p">(
  props: PolymorphicProps<T, DrawerDescriptionProps<T>>,
) => {
  const local = props as DrawerDescriptionProps;
  const rest = omit(local, "class");
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      class={cn("cn-drawer-description", local.class)}
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
