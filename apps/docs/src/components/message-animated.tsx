import type { ComponentProps } from "@solidjs/web";
import type { MessageAnimationPreset } from "~/lib/message-animations.ts";
import { MESSAGE_ANIMATIONS } from "~/lib/message-animations.ts";
import { cn } from "~/lib/utils.ts";
import { Bubble, BubbleContent } from "~/registry/ui/bubble.tsx";
import { MessageScrollerItem } from "~/registry/ui/message-scroller.tsx";
import { Message, MessageContent } from "~/registry/ui/message.tsx";
import type { Component } from "solid-js";
import { createMemo, For, omit } from "solid-js";

type MessageAnimatedMessage = {
  id: string;
  role: string;
  text: string;
};

type BubbleVariant = ComponentProps<typeof Bubble>["variant"];

type MessageAnimatedProps =
  & Omit<ComponentProps<typeof MessageScrollerItem>, "children" | "messageId">
  & {
    animationPreset?: MessageAnimationPreset;
    assistantVariant?: BubbleVariant;
    message: MessageAnimatedMessage;
    userVariant?: BubbleVariant;
  };

// The docs' animated transcript row: user rows animate in with the preset
// (upstream: motion.create(MessageScrollerItem)); assistant rows render plain.
const MessageAnimated: Component<MessageAnimatedProps> = (props) => {
  const others = omit(
    props,
    "animationPreset",
    "assistantVariant",
    "class",
    "message",
    "scrollAnchor",
    "userVariant",
  );
  const isUserMessage = () => props.message.role === "user";
  const preset = () => props.animationPreset ?? MESSAGE_ANIMATIONS["slide-up"];

  return (
    <MessageScrollerItem
      messageId={props.message.id}
      scrollAnchor={isUserMessage()
        ? (props.scrollAnchor ?? true)
        : props.scrollAnchor}
      class={cn(
        isUserMessage() && [preset().class, "motion-reduce:animate-none"],
        props.class,
      )}
      {...others}
    >
      <MessageAnimatedRow
        message={props.message}
        assistantVariant={props.assistantVariant ?? "ghost"}
        userVariant={props.userVariant ?? "muted"}
      />
    </MessageScrollerItem>
  );
};

const MessageAnimatedRow: Component<{
  assistantVariant: BubbleVariant;
  message: MessageAnimatedMessage;
  userVariant: BubbleVariant;
}> = (props) => {
  const isUserMessage = () => props.message.role === "user";
  const paragraphs = createMemo(() =>
    props.message.text
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
  );

  return (
    <Message align={isUserMessage() ? "end" : "start"}>
      <MessageContent>
        <Bubble
          variant={isUserMessage() ? props.userVariant : props.assistantVariant}
        >
          <BubbleContent class="space-y-2">
            <For each={paragraphs()} keyed={false}>
              {(paragraph) => <p class="whitespace-pre-wrap">{paragraph()}</p>}
            </For>
          </BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  );
};

export { MessageAnimated };
export type { MessageAnimatedProps };
