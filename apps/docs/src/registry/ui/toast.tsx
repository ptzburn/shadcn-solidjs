import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as ToastPrimitive from "@kobalte/core/toast";
import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web";
import { Portal } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import type { Component } from "solid-js";

import { omit, Show } from "solid-js";
import { Button } from "./button.tsx";

type ToastProps<T extends ValidComponent = "li"> =
  & ToastPrimitive.ToastRootProps<T>
  & { class?: string | undefined };

const Toast = <T extends ValidComponent = "li">(
  props: PolymorphicProps<T, ToastProps<T>>,
) => {
  const local = props as ToastProps;
  const rest = omit(local, "class");
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      class={cn(
        "group/toast pointer-events-auto relative flex w-full select-none rounded-2xl border bg-popover text-popover-foreground shadow-lg outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "data-opened:fade-in-0 data-opened:slide-in-from-bottom-full data-opened:animate-in",
        "data-closed:fade-out-80 data-closed:slide-out-to-right-full data-closed:animate-out",
        "data-[swipe=end]:fade-out-80 data-[swipe=end]:slide-out-to-right-full data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-(--kb-toast-swipe-move-x) data-[swipe=end]:animate-out data-[swipe=cancel]:transition-transform data-[swipe=move]:transition-none",
        local.class,
      )}
      {...rest}
    />
  );
};

const ToastContent: Component<ComponentProps<"div">> = (props) => {
  const rest = omit(props, "class");
  return (
    <div
      data-slot="toast-content"
      class={cn(
        "flex w-full items-center gap-3 overflow-hidden p-4 text-sm",
        props.class,
      )}
      {...rest}
    />
  );
};

type ToastTitleProps<T extends ValidComponent = "div"> =
  & ToastPrimitive.ToastTitleProps<T>
  & { class?: string | undefined };

const ToastTitle = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ToastTitleProps<T>>,
) => {
  const local = props as ToastTitleProps;
  const rest = omit(local, "class");
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      class={cn("font-medium text-sm", local.class)}
      {...rest}
    />
  );
};

type ToastDescriptionProps<T extends ValidComponent = "div"> =
  & ToastPrimitive.ToastDescriptionProps<T>
  & { class?: string | undefined };

const ToastDescription = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ToastDescriptionProps<T>>,
) => {
  const local = props as ToastDescriptionProps;
  const rest = omit(local, "class");
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      class={cn("text-muted-foreground text-sm", local.class)}
      {...rest}
    />
  );
};

type ToastActionProps<T extends ValidComponent = "button"> =
  & ToastPrimitive.ToastCloseButtonProps<T>
  & { class?: string | undefined; children?: JSX.Element };

const ToastAction = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ToastActionProps<T>>,
) => {
  const local = props as ToastActionProps;
  const rest = omit(local, "class");
  return (
    <ToastPrimitive.CloseButton
      data-slot="toast-action"
      as={Button<"button">}
      variant="outline"
      size="sm"
      class={cn("shrink-0", local.class)}
      {...rest}
    />
  );
};

type ToastCloseProps<T extends ValidComponent = "button"> =
  & ToastPrimitive.ToastCloseButtonProps<T>
  & { class?: string | undefined; children?: JSX.Element };

const ToastClose = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ToastCloseProps<T>>,
) => {
  const local = props as ToastCloseProps;
  const rest = omit(local, "class", "children");
  return (
    <ToastPrimitive.CloseButton
      data-slot="toast-close"
      aria-label="Close toast"
      as={Button<"button">}
      variant="ghost"
      size="icon-sm"
      class={cn(
        "relative shrink-0 text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-foreground",
        local.class,
      )}
      {...rest}
    >
      <Show
        when={local.children}
        fallback={
          <IconPlaceholder
            lucide="x"
            tabler="x"
            ph="x"
            ri="close-line"
            hugeicons="cancel-01"
            aria-hidden="true"
          />
        }
      >
        {local.children}
      </Show>
    </ToastPrimitive.CloseButton>
  );
};

type ToastType = "success" | "info" | "warning" | "error" | "loading";

const ToastIcon: Component<{ type?: ToastType }> = (props) => {
  return (
    <Show when={props.type}>
      <span
        data-slot="toast-icon"
        class="shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
      >
        <Show when={props.type === "success"}>
          <IconPlaceholder
            lucide="circle-check"
            tabler="circle-check"
            ph="check-circle"
            ri="checkbox-circle-line"
            hugeicons="checkmark-circle-02"
            aria-hidden="true"
          />
        </Show>
        <Show when={props.type === "info"}>
          <IconPlaceholder
            lucide="info"
            tabler="info-circle"
            ph="info"
            ri="information-line"
            hugeicons="information-circle"
            aria-hidden="true"
          />
        </Show>
        <Show when={props.type === "warning"}>
          <IconPlaceholder
            lucide="triangle-alert"
            tabler="alert-triangle"
            ph="warning"
            ri="error-warning-line"
            hugeicons="alert-02"
            aria-hidden="true"
          />
        </Show>
        <Show when={props.type === "error"}>
          <IconPlaceholder
            lucide="octagon-x"
            tabler="alert-octagon"
            ph="x-circle"
            ri="close-circle-line"
            hugeicons="multiplication-sign-circle"
            class="text-destructive"
            aria-hidden="true"
          />
        </Show>
        <Show when={props.type === "loading"}>
          <IconPlaceholder
            lucide="loader-circle"
            tabler="loader"
            ph="spinner"
            ri="loader-line"
            hugeicons="loading-03"
            class="animate-spin"
            aria-hidden="true"
          />
        </Show>
      </span>
    </Show>
  );
};

interface ToastAddOptions {
  title?: JSX.Element;
  description?: JSX.Element;
  type?: ToastType;
  actionProps?: ToastActionProps<"button">;
  duration?: number;
  persistent?: boolean;
}

const ToastTemplate: Component<ToastAddOptions & { toastId: number }> = (
  props,
) => {
  return (
    <Toast
      toastId={props.toastId}
      duration={props.duration}
      persistent={props.persistent}
    >
      <ToastContent>
        <ToastIcon type={props.type} />
        <div class="flex min-w-0 flex-1 flex-col gap-1">
          <Show when={props.title}>
            <ToastTitle>{props.title}</ToastTitle>
          </Show>
          <Show when={props.description}>
            <ToastDescription>{props.description}</ToastDescription>
          </Show>
        </div>
        <Show when={props.actionProps}>
          <ToastAction {...props.actionProps} />
        </Show>
        <ToastClose />
      </ToastContent>
    </Toast>
  );
};

interface ToastPromiseMessages<T, U = unknown> {
  loading?: JSX.Element;
  success?: JSX.Element | ((data: T) => JSX.Element);
  error?: JSX.Element | ((error: U) => JSX.Element);
}

const toast = {
  /** Show a toast and return its id. */
  add(options: ToastAddOptions): number {
    return ToastPrimitive.toaster.show((props) => (
      <ToastTemplate toastId={props.toastId} {...options} />
    ));
  },
  /** Close a toast by id. */
  close(id: number) {
    ToastPrimitive.toaster.dismiss(id);
  },
  /** Close all toasts. */
  clear() {
    ToastPrimitive.toaster.clear();
  },
  /** Track a promise with loading, success, and error toasts. */
  promise<T, U = unknown>(
    promise: Promise<T>,
    messages: ToastPromiseMessages<T, U>,
  ): number {
    return ToastPrimitive.toaster.promise<T, U>(promise, (props) => {
      const type = (): ToastType =>
        props.state === "pending"
          ? "loading"
          : props.state === "fulfilled"
          ? "success"
          : "error";
      const description = () => {
        if (props.state === "pending") return messages.loading;
        if (props.state === "fulfilled") {
          return typeof messages.success === "function"
            ? messages.success(props.data as T)
            : messages.success;
        }
        return typeof messages.error === "function"
          ? messages.error(props.error as U)
          : messages.error;
      };
      return (
        <ToastTemplate
          toastId={props.toastId}
          type={type()}
          description={description()}
          persistent={props.state === "pending"}
        />
      );
    });
  },
};

type ToasterProps = ToastPrimitive.ToastRegionProps & {
  class?: string | undefined;
};

const Toaster: Component<ToasterProps> = (props) => {
  const local = props as ToasterProps;
  const rest = omit(local, "class");
  return (
    <Portal>
      <ToastPrimitive.Region
        swipeDirection="right"
        pauseOnInteraction
        {...rest}
      >
        <ToastPrimitive.List
          data-slot="toast-viewport"
          class={cn(
            "fixed inset-x-4 bottom-4 z-50 mx-auto flex w-auto max-w-sm flex-col list-none gap-3 p-0 outline-none sm:right-4 sm:left-auto sm:mx-0 sm:w-full",
            local.class,
          )}
        />
      </ToastPrimitive.Region>
    </Portal>
  );
};

export {
  Toast,
  toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  Toaster,
  ToastIcon,
  ToastTitle,
};
