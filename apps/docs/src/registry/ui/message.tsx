import type { ComponentProps } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";

import type { Component } from "solid-js";

import { omit } from "solid-js";

const MessageGroup: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="message-group"
      class={cn("cn-message-group flex min-w-0 flex-col", props.class)}
      {...others}
    />
  );
};

type MessageProps = ComponentProps<"div"> & { align?: "start" | "end" };

const Message: Component<MessageProps> = (props) => {
  const others = omit(props, "class", "align");
  return (
    <div
      data-slot="message"
      data-align={props.align ?? "start"}
      class={cn(
        "cn-message group/message relative flex w-full min-w-0 data-[align=end]:flex-row-reverse",
        props.class,
      )}
      {...others}
    />
  );
};

const MessageAvatar: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="message-avatar"
      class={cn(
        "cn-message-avatar flex w-fit shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted",
        props.class,
      )}
      {...others}
    />
  );
};

const MessageContent: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="message-content"
      class={cn(
        "cn-message-content wrap-break-word flex w-full min-w-0 flex-col",
        props.class,
      )}
      {...others}
    />
  );
};

const MessageHeader: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="message-header"
      class={cn(
        "cn-message-header flex min-w-0 max-w-full items-center",
        props.class,
      )}
      {...others}
    />
  );
};

const MessageFooter: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="message-footer"
      class={cn(
        "cn-message-footer flex min-w-0 max-w-full items-center group-data-[align=end]/message:justify-end",
        props.class,
      )}
      {...others}
    />
  );
};

export type { MessageProps };
export {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
};
