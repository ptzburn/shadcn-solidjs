import { cn } from "~/lib/utils.ts";

import type { Component, ComponentProps } from "solid-js";

import { splitProps } from "solid-js";

const MessageGroup: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="message-group"
      class={cn("cn-message-group flex min-w-0 flex-col", local.class)}
      {...others}
    />
  );
};

type MessageProps = ComponentProps<"div"> & { align?: "start" | "end" };

const Message: Component<MessageProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "align"]);
  return (
    <div
      data-slot="message"
      data-align={local.align ?? "start"}
      class={cn(
        "cn-message group/message relative flex w-full min-w-0 data-[align=end]:flex-row-reverse",
        local.class,
      )}
      {...others}
    />
  );
};

const MessageAvatar: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="message-avatar"
      class={cn(
        "cn-message-avatar flex w-fit shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted",
        local.class,
      )}
      {...others}
    />
  );
};

const MessageContent: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="message-content"
      class={cn(
        "cn-message-content flex w-full min-w-0 flex-col wrap-break-word",
        local.class,
      )}
      {...others}
    />
  );
};

const MessageHeader: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="message-header"
      class={cn(
        "cn-message-header flex max-w-full min-w-0 items-center",
        local.class,
      )}
      {...others}
    />
  );
};

const MessageFooter: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="message-footer"
      class={cn(
        "cn-message-footer flex max-w-full min-w-0 items-center group-data-[align=end]/message:justify-end",
        local.class,
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
