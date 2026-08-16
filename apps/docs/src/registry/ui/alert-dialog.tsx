import * as AlertDialogPrimitive from "@kobalte/core/alert-dialog";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { VariantProps } from "class-variance-authority";
import type { Component } from "solid-js";

import { omit } from "solid-js";
import { buttonVariants } from "./button.tsx";

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
  const local = props as AlertDialogOverlayProps;
  const rest = omit(local, "class");
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      class={cn(
        "data-closed:fade-out-0 data-expanded:fade-in-0 fixed inset-0 z-50 bg-black/10 duration-100 data-closed:animate-out data-expanded:animate-in supports-backdrop-filter:backdrop-blur-xs",
        local.class,
      )}
      {...rest}
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
  const local = props as AlertDialogContentProps;
  const rest = omit(local, "class", "children", "size");
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-size={local.size ?? "default"}
        class={cn(
          "data-closed:fade-out-0 data-closed:zoom-out-95 data-expanded:fade-in-0 data-expanded:zoom-in-95 group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-popover-foreground outline-none ring-1 ring-foreground/10 duration-100 data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-closed:animate-out data-expanded:animate-in data-[size=default]:sm:max-w-sm",
          local.class,
        )}
        {...rest}
      >
        {local.children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  );
};

const AlertDialogHeader: Component<ComponentProps<"div">> = (props) => {
  const rest = omit(props, "class");
  return (
    <div
      data-slot="alert-dialog-header"
      class={cn(
        "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr] has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4",
        props.class,
      )}
      {...rest}
    />
  );
};

const AlertDialogFooter: Component<ComponentProps<"div">> = (props) => {
  const rest = omit(props, "class");
  return (
    <div
      data-slot="alert-dialog-footer"
      class={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2",
        props.class,
      )}
      {...rest}
    />
  );
};

const AlertDialogMedia: Component<ComponentProps<"div">> = (props) => {
  const rest = omit(props, "class");
  return (
    <div
      data-slot="alert-dialog-media"
      class={cn(
        "mb-2 inline-flex size-10 items-center justify-center rounded-md bg-muted *:[svg:not([class*='size-'])]:size-6 sm:group-data-[size=default]/alert-dialog-content:row-span-2",
        props.class,
      )}
      {...rest}
    />
  );
};

type AlertDialogTitleProps<T extends ValidComponent = "h2"> =
  & AlertDialogPrimitive.AlertDialogTitleProps<T>
  & { class?: string | undefined };

const AlertDialogTitle = <T extends ValidComponent = "h2">(
  props: PolymorphicProps<T, AlertDialogTitleProps<T>>,
) => {
  const local = props as AlertDialogTitleProps;
  const rest = omit(local, "class");
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      class={cn(
        "font-heading font-medium text-base sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
        local.class,
      )}
      {...rest}
    />
  );
};

type AlertDialogDescriptionProps<T extends ValidComponent = "p"> =
  & AlertDialogPrimitive.AlertDialogDescriptionProps<T>
  & { class?: string | undefined };

const AlertDialogDescription = <T extends ValidComponent = "p">(
  props: PolymorphicProps<T, AlertDialogDescriptionProps<T>>,
) => {
  const local = props as AlertDialogDescriptionProps;
  const rest = omit(local, "class");
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      class={cn(
        "text-balance text-muted-foreground text-sm *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground md:text-pretty",
        local.class,
      )}
      {...rest}
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
  const local = props as AlertDialogActionProps;
  const rest = omit(local, "class", "children", "variant", "size");
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
      {...rest}
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
  const local = props as AlertDialogCancelProps;
  const rest = omit(local, "class", "children", "variant", "size");
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
      {...rest}
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
