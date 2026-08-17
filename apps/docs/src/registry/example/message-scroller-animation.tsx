import { MessageAnimated } from "~/components/message-animated.tsx";
import { createChat, createChatSession } from "~/lib/ai.ts";
import type { MessageAnimationId } from "~/lib/message-animations.ts";
import { MESSAGE_ANIMATIONS } from "~/lib/message-animations.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/registry/ui/card.tsx";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/registry/ui/empty.tsx";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "~/registry/ui/message-scroller.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/registry/ui/select.tsx";
import { createMemo, createSignal, For, Show } from "solid-js";

const chat = createChat()
  .user("Can user messages pop in like iMessage without breaking anchoring?")
  .sleep(1000)
  .assistant(
    "Yes. Animate the user row with transform and opacity, and let the assistant response stream normally below it.\n\nThat keeps the row measurement predictable while still giving the newly sent bubble a more tactile entrance.",
  )
  .user("What makes the animation feel more like iMessage?")
  .sleep(1000)
  .assistant(
    "Use a quick spring from the trailing edge: a little scale, a small upward move, and no layout animation.\n\nThe bubble feels tactile, but the measured row stays predictable, so anchoring and auto-scroll do not have to fight a changing layout.",
  )
  .user("Can I switch between presets while testing the same thread?")
  .sleep(1000)
  .assistant(
    "Yes. Keep the conversation in place while you change the preset, then send the next message to compare the new entrance against the same context.\n\nThat makes it easier to judge the difference between a subtle fade, a snappy pop, and a more dramatic 3D tilt without rebuilding the scenario each time.",
  );

const initialMessages = chat.get(0);
const transport = chat.transport({ delayMs: 15 });
const PRESETS = Object.values(MESSAGE_ANIMATIONS);

export default function MessageScrollerAnimation() {
  const { messages, sendMessage, status, setMessages } = createChatSession({
    messages: initialMessages,
    transport,
  });
  const [presetId, setPresetId] = createSignal<MessageAnimationId>("fade");
  const nextMessage = createMemo(() => chat.next(messages));
  const isBusy = () => status() === "submitted" || status() === "streaming";
  const preset = () => MESSAGE_ANIMATIONS[presetId()];

  return (
    <div class="relative flex flex-col gap-4">
      <Card class="mx-auto h-140 w-full max-w-sm gap-0">
        <CardHeader class="border-b">
          <CardTitle>Animation</CardTitle>
          <CardDescription>
            Choose how user messages are animated when they are added to the
            conversation.
          </CardDescription>
          <CardAction class="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Reset animated messages"
              disabled={messages.length === 0 || isBusy()}
              onClick={() => setMessages(initialMessages)}
            >
              <IconPlaceholder
                lucide="rotate-cw"
                tabler="rotate"
                ph="arrow-clockwise"
                ri="refresh-line"
                hugeicons="refresh"
              />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent class="min-h-0 flex-1 overflow-hidden p-0">
          <Show
            when={messages.length > 0}
            fallback={
              <Empty class="h-full">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <IconPlaceholder
                      lucide="message-circle-dashed"
                      tabler="message-circle"
                      ph="chat-circle-dots"
                      ri="chat-3-line"
                      hugeicons="message-square-dashed"
                    />
                  </EmptyMedia>
                  <EmptyTitle>No Messages Yet</EmptyTitle>
                  <EmptyDescription>
                    Click the button below to send the first message.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            }
          >
            <MessageScrollerProvider>
              <MessageScroller>
                <MessageScrollerViewport>
                  <MessageScrollerContent
                    aria-busy={isBusy() ? "true" : "false"}
                    class="p-(--card-spacing)"
                  >
                    <For each={messages}>
                      {(message) => (
                        <MessageAnimated
                          message={message}
                          animationPreset={preset()}
                          userVariant="muted"
                          assistantVariant="ghost"
                        />
                      )}
                    </For>
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            </MessageScrollerProvider>
          </Show>
        </CardContent>
        <CardFooter class="border-t">
          <Select<(typeof PRESETS)[number]>
            options={PRESETS}
            optionValue="id"
            optionTextValue="name"
            value={preset()}
            onChange={(value) => value && setPresetId(value.id)}
            placement="top-start"
            itemComponent={(itemProps) => (
              <SelectItem item={itemProps.item}>
                {itemProps.item.rawValue.name}
              </SelectItem>
            )}
          >
            <SelectTrigger aria-label="Animation preset" class="w-40">
              <SelectValue<(typeof PRESETS)[number]>>
                {(state) => state.selectedOption().name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
          <Button
            type="button"
            size="icon"
            class="ml-auto"
            disabled={!nextMessage() || isBusy()}
            onClick={() => {
              const next = nextMessage();
              if (!next || isBusy()) {
                return;
              }
              sendMessage(next);
            }}
          >
            <IconPlaceholder
              lucide="arrow-up"
              tabler="arrow-up"
              ph="arrow-up"
              ri="arrow-up-line"
              hugeicons="arrow-up-02"
            />
            <span class="sr-only">Send Message</span>
          </Button>
        </CardFooter>
      </Card>
      <div class="mx-auto max-w-sm text-balance px-0.5 text-center text-muted-foreground text-xs">
        Select an animation then click send to see it in action.
      </div>
    </div>
  );
}
