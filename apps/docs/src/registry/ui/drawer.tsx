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
  // Opacity needs no manual style merge — the primitive drives it from
  // openPercentage during drag and close.
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      class={cn(
        "fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs data-transitioning:transition-opacity data-transitioning:duration-300",
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
          "group/drawer-content fixed z-50 flex h-auto flex-col bg-popover text-popover-foreground text-sm data-[side=bottom]:inset-x-0 data-[side=left]:inset-y-0 data-[side=right]:inset-y-0 data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=right]:right-0 data-[side=bottom]:bottom-0 data-[side=left]:left-0 data-[side=bottom]:mt-24 data-[side=top]:mb-24 data-[side=bottom]:max-h-[80vh] data-[side=top]:max-h-[80vh] data-[side=left]:w-3/4 data-[side=right]:w-3/4 data-[side=bottom]:rounded-t-xl data-[side=left]:rounded-r-xl data-[side=right]:rounded-l-xl data-[side=top]:rounded-b-xl data-[side=bottom]:border-t data-[side=left]:border-r data-[side=right]:border-l data-[side=top]:border-b data-transitioning:transition-transform data-transitioning:duration-300 data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
          local.class,
        )}
        {...rest}
      >
        <div class="mx-auto mt-4 hidden h-1 w-[100px] shrink-0 rounded-full bg-muted group-data-[side=bottom]/drawer-content:block" />
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
        "flex flex-col gap-0.5 p-4 md:gap-0.5 md:text-left group-data-[side=bottom]/drawer-content:text-center group-data-[side=top]/drawer-content:text-center",
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
      class={cn("mt-auto flex flex-col gap-2 p-4", props.class)}
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
        "font-heading font-medium text-base text-foreground",
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
      class={cn("text-muted-foreground text-sm", local.class)}
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
