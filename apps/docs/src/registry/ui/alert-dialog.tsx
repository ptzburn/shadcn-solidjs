import * as AlertDialogPrimitive from "@kobalte/core/alert-dialog";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";

import { buttonVariants } from "./button.tsx";
import { cn } from "~/lib/utils.ts";
import type { VariantProps } from "class-variance-authority";

import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogPortal = AlertDialogPrimitive.Portal;

type AlertDialogTriggerProps<T extends ValidComponent = "button"> =
  & AlertDialogPrimitive.AlertDialogTriggerProps<T>
  & { class?: string | undefined };

const AlertDialogTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, AlertDialogTriggerProps<T>>,
) => {
  return (
    <AlertDialogPrimitive.Trigger
      data-slot="alert-dialog-trigger"
      {...(props as AlertDialogTriggerProps)}
    />
  );
};

type AlertDialogOverlayProps<T extends ValidComponent = "div"> =
  & AlertDialogPrimitive.AlertDialogOverlayProps<T>
  & { class?: string | undefined };

const AlertDialogOverlay = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AlertDialogOverlayProps<T>>,
) => {
  const [local, others] = splitProps(props as AlertDialogOverlayProps, [
    "class",
  ]);
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      class={cn(
        "cn-alert-dialog-overlay fixed inset-0 z-50",
        local.class,
      )}
      {...others}
    />
  );
};

type AlertDialogContentProps<T extends ValidComponent = "div"> =
  & AlertDialogPrimitive.AlertDialogContentProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
    size?: "default" | "sm";
  };

const AlertDialogContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AlertDialogContentProps<T>>,
) => {
  const [local, others] = splitProps(props as AlertDialogContentProps, [
    "class",
    "children",
    "size",
  ]);
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-size={local.size ?? "default"}
        class={cn(
          "cn-alert-dialog-content group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 outline-none",
          local.class,
        )}
        {...others}
      >
        {local.children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  );
};

const AlertDialogHeader: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="alert-dialog-header"
      class={cn(
        "cn-alert-dialog-header",
        local.class,
      )}
      {...others}
    />
  );
};

const AlertDialogFooter: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="alert-dialog-footer"
      class={cn(
        "cn-alert-dialog-footer flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        local.class,
      )}
      {...others}
    />
  );
};

const AlertDialogMedia: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="alert-dialog-media"
      class={cn(
        "cn-alert-dialog-media",
        local.class,
      )}
      {...others}
    />
  );
};

type AlertDialogTitleProps<T extends ValidComponent = "h2"> =
  & AlertDialogPrimitive.AlertDialogTitleProps<T>
  & { class?: string | undefined };

const AlertDialogTitle = <T extends ValidComponent = "h2">(
  props: PolymorphicProps<T, AlertDialogTitleProps<T>>,
) => {
  const [local, others] = splitProps(props as AlertDialogTitleProps, ["class"]);
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      class={cn(
        "cn-alert-dialog-title font-heading",
        local.class,
      )}
      {...others}
    />
  );
};

type AlertDialogDescriptionProps<T extends ValidComponent = "p"> =
  & AlertDialogPrimitive.AlertDialogDescriptionProps<T>
  & { class?: string | undefined };

const AlertDialogDescription = <T extends ValidComponent = "p">(
  props: PolymorphicProps<T, AlertDialogDescriptionProps<T>>,
) => {
  const [local, others] = splitProps(props as AlertDialogDescriptionProps, [
    "class",
  ]);
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      class={cn(
        "cn-alert-dialog-description",
        local.class,
      )}
      {...others}
    />
  );
};

type AlertDialogActionProps<T extends ValidComponent = "button"> =
  & AlertDialogPrimitive.AlertDialogCloseButtonProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
    variant?: VariantProps<typeof buttonVariants>["variant"];
    size?: VariantProps<typeof buttonVariants>["size"];
  };

const AlertDialogAction = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, AlertDialogActionProps<T>>,
) => {
  const [local, others] = splitProps(props as AlertDialogActionProps, [
    "class",
    "children",
    "variant",
    "size",
  ]);
  return (
    <AlertDialogPrimitive.CloseButton
      data-slot="alert-dialog-action"
      class={cn(
        buttonVariants({
          variant: local.variant ?? "default",
          size: local.size ?? "default",
        }),
        local.class,
      )}
      {...others}
    >
      {local.children}
    </AlertDialogPrimitive.CloseButton>
  );
};

type AlertDialogCancelProps<T extends ValidComponent = "button"> =
  & AlertDialogPrimitive.AlertDialogCloseButtonProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
    variant?: VariantProps<typeof buttonVariants>["variant"];
    size?: VariantProps<typeof buttonVariants>["size"];
  };

const AlertDialogCancel = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, AlertDialogCancelProps<T>>,
) => {
  const [local, others] = splitProps(props as AlertDialogCancelProps, [
    "class",
    "children",
    "variant",
    "size",
  ]);
  return (
    <AlertDialogPrimitive.CloseButton
      data-slot="alert-dialog-cancel"
      class={cn(
        buttonVariants({
          variant: local.variant ?? "outline",
          size: local.size ?? "default",
        }),
        local.class,
      )}
      {...others}
    >
      {local.children}
    </AlertDialogPrimitive.CloseButton>
  );
};

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
