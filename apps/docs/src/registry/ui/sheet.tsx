import * as SheetPrimitive from "@kobalte/core/dialog";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import type { Component } from "solid-js";

import { merge, omit, Show } from "solid-js";
import { buttonVariants } from "./button.tsx";

const Sheet = SheetPrimitive.Root;
const SheetPortal = SheetPrimitive.Portal;

type SheetTriggerProps<T extends ValidComponent = "button"> =
  & SheetPrimitive.DialogTriggerProps<T>
  & { class?: string | undefined };

const SheetTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, SheetTriggerProps<T>>,
) => {
  return (
    <SheetPrimitive.Trigger
      data-slot="sheet-trigger"
      {...(props as SheetTriggerProps)}
    />
  );
};

type SheetCloseProps<T extends ValidComponent = "button"> =
  & SheetPrimitive.DialogCloseButtonProps<T>
  & { class?: string | undefined };

const SheetClose = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, SheetCloseProps<T>>,
) => {
  return (
    <SheetPrimitive.CloseButton
      data-slot="sheet-close"
      {...(props as SheetCloseProps)}
    />
  );
};

type SheetOverlayProps<T extends ValidComponent = "div"> =
  & SheetPrimitive.DialogOverlayProps<T>
  & { class?: string | undefined };

const SheetOverlay = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SheetOverlayProps<T>>,
) => {
  const local = props as SheetOverlayProps;
  const others = omit(local, "class");
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      class={cn(
        "cn-sheet-overlay data-closed:fade-out-0 data-expanded:fade-in-0 fixed inset-0 z-50 duration-100 data-closed:animate-out data-expanded:animate-in",
        local.class,
      )}
      {...others}
    />
  );
};

type SheetContentProps<T extends ValidComponent = "div"> =
  & SheetPrimitive.DialogContentProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
    side?: "top" | "right" | "bottom" | "left";
    showCloseButton?: boolean;
  };

const SheetContent = <T extends ValidComponent = "div">(
  rawProps: PolymorphicProps<T, SheetContentProps<T>>,
) => {
  const props = merge(
    { side: "right" as const, showCloseButton: true },
    rawProps as SheetContentProps,
  );
  const others = omit(props, "class", "children", "side", "showCloseButton");
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={props.side}
        class={cn(
          "cn-sheet-content data-[side=bottom]:data-closed:slide-out-to-bottom-10 data-[side=bottom]:data-expanded:slide-in-from-bottom-10 data-[side=left]:data-closed:slide-out-to-left-10 data-[side=left]:data-expanded:slide-in-from-left-10 data-[side=right]:data-closed:slide-out-to-right-10 data-[side=right]:data-expanded:slide-in-from-right-10 data-[side=top]:data-closed:slide-out-to-top-10 data-[side=top]:data-expanded:slide-in-from-top-10 data-closed:fade-out-0 data-expanded:fade-in-0 data-closed:animate-out data-expanded:animate-in",
          props.class,
        )}
        {...others}
      >
        {props.children}
        <Show when={props.showCloseButton}>
          <SheetPrimitive.CloseButton
            data-slot="sheet-close"
            class={cn(
              buttonVariants({ variant: "ghost", size: "icon-sm" }),
              "cn-sheet-close",
            )}
          >
            <IconPlaceholder
              lucide="x"
              tabler="x"
              ph="x"
              ri="close-line"
              hugeicons="cancel-01"
            />
            <span class="sr-only">Close</span>
          </SheetPrimitive.CloseButton>
        </Show>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
};

const SheetHeader: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="sheet-header"
      class={cn("cn-sheet-header flex flex-col", props.class)}
      {...others}
    />
  );
};

const SheetFooter: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="sheet-footer"
      class={cn("cn-sheet-footer mt-auto flex flex-col", props.class)}
      {...others}
    />
  );
};

type SheetTitleProps<T extends ValidComponent = "h2"> =
  & SheetPrimitive.DialogTitleProps<T>
  & { class?: string | undefined };

const SheetTitle = <T extends ValidComponent = "h2">(
  props: PolymorphicProps<T, SheetTitleProps<T>>,
) => {
  const local = props as SheetTitleProps;
  const others = omit(local, "class");
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      class={cn(
        "cn-sheet-title font-heading",
        local.class,
      )}
      {...others}
    />
  );
};

type SheetDescriptionProps<T extends ValidComponent = "p"> =
  & SheetPrimitive.DialogDescriptionProps<T>
  & { class?: string | undefined };

const SheetDescription = <T extends ValidComponent = "p">(
  props: PolymorphicProps<T, SheetDescriptionProps<T>>,
) => {
  const local = props as SheetDescriptionProps;
  const others = omit(local, "class");
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      class={cn("cn-sheet-description", local.class)}
      {...others}
    />
  );
};

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
