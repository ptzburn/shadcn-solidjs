import type { ComponentProps } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";

import type { Component } from "solid-js";

import { omit } from "solid-js";

const MessageGroup: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="message-group"
      class={cn("flex min-w-0 flex-col gap-2", props.class)}
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
        "group/message relative flex w-full min-w-0 gap-2 text-sm data-[align=end]:flex-row-reverse",
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
        "flex w-fit min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted group-has-data-[slot=message-footer]/message:-translate-y-8",
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
        "wrap-break-word flex w-full min-w-0 flex-col gap-2.5 group-data-[align=end]/message:*:data-slot:self-end",
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
        "flex min-w-0 max-w-full items-center px-3 font-medium text-muted-foreground text-xs group-has-data-[variant=ghost]/message:px-0",
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
        "flex min-w-0 max-w-full items-center px-3 font-medium text-muted-foreground text-xs group-data-[align=end]/message:justify-end group-has-data-[variant=ghost]/message:px-0",
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
