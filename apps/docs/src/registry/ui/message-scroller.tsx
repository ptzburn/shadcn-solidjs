import type {
  MessageScrollerButtonDirection,
  MessageScrollerContentProps,
  MessageScrollerItemProps,
  MessageScrollerViewportProps,
} from "@ptzburn/shadcn-solid/message-scroller";
import {
  MessageScroller as MessageScrollerPrimitive,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@ptzburn/shadcn-solid/message-scroller";
import type { ComponentProps } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import type { Component } from "solid-js";
import { omit } from "solid-js";
import type { ButtonProps } from "./button.tsx";
import { Button } from "./button.tsx";

const MessageScrollerProvider = MessageScrollerPrimitive.Provider;

const MessageScroller: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <MessageScrollerPrimitive.Root
      data-slot="message-scroller"
      class={cn(
        "cn-message-scroller group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden",
        props.class,
      )}
      {...others}
    />
  );
};

const MessageScrollerViewport: Component<MessageScrollerViewportProps> = (
  props,
) => {
  const others = omit(props, "class");
  return (
    <MessageScrollerPrimitive.Viewport
      data-slot="message-scroller-viewport"
      class={cn(
        "cn-message-scroller-viewport data-autoscrolling:scrollbar-thumb-transparent data-autoscrolling:scrollbar-track-transparent scroll-fade-b scrollbar-gutter-stable scrollbar-thin size-full min-h-0 min-w-0 overflow-y-auto overscroll-contain contain-content",
        props.class,
      )}
      {...others}
    />
  );
};

const MessageScrollerContent: Component<MessageScrollerContentProps> = (
  props,
) => {
  const others = omit(props, "class");
  return (
    <MessageScrollerPrimitive.Content
      data-slot="message-scroller-content"
      class={cn(
        "cn-message-scroller-content flex h-max min-h-full flex-col",
        props.class,
      )}
      {...others}
    />
  );
};

const MessageScrollerItem: Component<MessageScrollerItemProps> = (props) => {
  const others = omit(props, "class", "scrollAnchor");
  return (
    <MessageScrollerPrimitive.Item
      data-slot="message-scroller-item"
      scrollAnchor={props.scrollAnchor ?? false}
      class={cn(
        "[contain-intrinsic-size:auto_10rem] [content-visibility:auto] cn-message-scroller-item min-w-0 shrink-0",
        props.class,
      )}
      {...others}
    />
  );
};

type MessageScrollerButtonProps =
  & ComponentProps<"button">
  & Pick<ButtonProps, "variant" | "size">
  & {
    behavior?: ScrollBehavior;
    direction?: MessageScrollerButtonDirection;
  };

const MessageScrollerButton: Component<MessageScrollerButtonProps> = (
  props,
) => {
  const others = omit(
    props,
    "class",
    "children",
    "direction",
    "variant",
    "size",
  );
  const direction = (): MessageScrollerButtonDirection =>
    props.direction ?? "end";
  const variant = (): MessageScrollerButtonProps["variant"] =>
    props.variant ?? "secondary";
  const size = (): MessageScrollerButtonProps["size"] =>
    props.size ?? "icon-sm";

  return (
    <MessageScrollerPrimitive.Button
      as={Button<"button">}
      data-slot="message-scroller-button"
      data-direction={direction()}
      data-variant={variant()}
      data-size={size()}
      direction={direction()}
      variant={variant()}
      size={size()}
      class={cn(
        "cn-message-scroller-button absolute inset-s-1/2 -translate-x-1/2 border-border bg-background text-foreground transition-[translate,scale,opacity] duration-200 hover:bg-muted hover:text-foreground rtl:translate-x-1/2 data-[active=false]:pointer-events-none data-[direction=start]:top-4 data-[direction=end]:bottom-4 data-[active=true]:translate-y-0 data-[active=false]:scale-95 data-[active=true]:scale-100 data-[active=false]:opacity-0 data-[active=true]:opacity-100 data-[active=false]:duration-400 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)] data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)] data-[direction=start]:data-[active=false]:-translate-y-full data-[direction=end]:data-[active=false]:translate-y-full data-[direction=start]:[&_svg]:rotate-180",
        props.class,
      )}
      {...others}
    >
      {props.children ?? (
        <>
          <IconPlaceholder
            lucide="arrow-down"
            tabler="arrow-down"
            ph="arrow-down"
            ri="arrow-down-line"
            hugeicons="arrow-down-02"
          />
          <span class="sr-only">
            {direction() === "end" ? "Scroll to end" : "Scroll to start"}
          </span>
        </>
      )}
    </MessageScrollerPrimitive.Button>
  );
};

export type { MessageScrollerButtonProps };
export {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
};
