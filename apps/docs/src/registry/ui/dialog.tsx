import * as DialogPrimitive from "@kobalte/core/dialog";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";

import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js";

import { Show, splitProps } from "solid-js";
import { buttonVariants } from "./button.tsx";

const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;

type DialogTriggerProps<T extends ValidComponent = "button"> =
  & DialogPrimitive.DialogTriggerProps<T>
  & { class?: string | undefined };

const DialogTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, DialogTriggerProps<T>>,
) => {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      {...(props as DialogTriggerProps)}
    />
  );
};

type DialogCloseProps<T extends ValidComponent = "button"> =
  & DialogPrimitive.DialogCloseButtonProps<T>
  & { class?: string | undefined };

const DialogClose = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, DialogCloseProps<T>>,
) => {
  return (
    <DialogPrimitive.CloseButton
      data-slot="dialog-close"
      {...(props as DialogCloseProps)}
    />
  );
};

type DialogOverlayProps<T extends ValidComponent = "div"> =
  & DialogPrimitive.DialogOverlayProps<T>
  & { class?: string | undefined };

const DialogOverlay = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DialogOverlayProps<T>>,
) => {
  const [local, rest] = splitProps(props as DialogOverlayProps, ["class"]);
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      class={cn(
        "cn-dialog-overlay fixed inset-0 isolate z-50",
        local.class,
      )}
      {...rest}
    />
  );
};

type DialogContentProps<T extends ValidComponent = "div"> =
  & DialogPrimitive.DialogContentProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
    showCloseButton?: boolean;
  };

const DialogContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DialogContentProps<T>>,
) => {
  const [local, rest] = splitProps(props as DialogContentProps, [
    "class",
    "children",
    "showCloseButton",
  ]);
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        class={cn(
          "cn-dialog-content fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 outline-none",
          local.class,
        )}
        {...rest}
      >
        {local.children}
        <Show when={local.showCloseButton ?? true}>
          <DialogPrimitive.CloseButton
            data-slot="dialog-close"
            class={cn(
              buttonVariants({ variant: "ghost", size: "icon-sm" }),
              "cn-dialog-close",
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
          </DialogPrimitive.CloseButton>
        </Show>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
};

const DialogHeader: Component<ComponentProps<"div">> = (props) => {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="dialog-header"
      class={cn("cn-dialog-header flex flex-col", local.class)}
      {...rest}
    />
  );
};

type DialogFooterProps = ComponentProps<"div"> & {
  showCloseButton?: boolean;
  children?: JSX.Element;
};

const DialogFooter: Component<DialogFooterProps> = (props) => {
  const [local, rest] = splitProps(props, [
    "class",
    "showCloseButton",
    "children",
  ]);
  return (
    <div
      data-slot="dialog-footer"
      class={cn(
        "cn-dialog-footer flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        local.class,
      )}
      {...rest}
    >
      {local.children}
      <Show when={local.showCloseButton}>
        <DialogPrimitive.CloseButton
          class={cn(buttonVariants({ variant: "outline" }))}
        >
          Close
        </DialogPrimitive.CloseButton>
      </Show>
    </div>
  );
};

type DialogTitleProps<T extends ValidComponent = "h2"> =
  & DialogPrimitive.DialogTitleProps<T>
  & { class?: string | undefined };

const DialogTitle = <T extends ValidComponent = "h2">(
  props: PolymorphicProps<T, DialogTitleProps<T>>,
) => {
  const [local, rest] = splitProps(props as DialogTitleProps, ["class"]);
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      class={cn(
        "cn-dialog-title font-heading",
        local.class,
      )}
      {...rest}
    />
  );
};

type DialogDescriptionProps<T extends ValidComponent = "p"> =
  & DialogPrimitive.DialogDescriptionProps<T>
  & { class?: string | undefined };

const DialogDescription = <T extends ValidComponent = "p">(
  props: PolymorphicProps<T, DialogDescriptionProps<T>>,
) => {
  const [local, rest] = splitProps(props as DialogDescriptionProps, ["class"]);
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      class={cn(
        "cn-dialog-description",
        local.class,
      )}
      {...rest}
    />
  );
};

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
