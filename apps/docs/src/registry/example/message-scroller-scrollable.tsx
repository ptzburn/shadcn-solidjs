import { For } from "solid-js";

import { Bubble, BubbleContent } from "~/registry/ui/bubble.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/registry/ui/card.tsx";
import { Message, MessageContent } from "~/registry/ui/message.tsx";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScrollerScrollable,
} from "~/registry/ui/message-scroller.tsx";

const messages = Array.from({ length: 12 }, (_, index) => ({
  id: `scrollable-${index + 1}`,
  role: (index % 2 === 0 ? "user" : "assistant") as "user" | "assistant",
  text: index % 2 === 0
    ? `Review scroll checkpoint ${index + 1}.`
    : `Checkpoint ${
      index + 1
    } is synced. The scrollable hook updates as the viewport moves.\n\nWhen the reader is at the first message, the footer should only point them down. Once they move into the middle of the transcript, it should explain that both directions are available.\n\nAt the latest message, the footer should switch again and only point them back up.`,
}));

const paragraphsOf = (text: string) =>
  text.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);

function getScrollStatus(start: boolean, end: boolean) {
  if (start && end) return "You can scroll both ways.";
  if (end) return "You are at the top. You can only scroll down.";
  if (start) return "You are at the bottom. You can only scroll up.";
  return "All messages fit in the viewport.";
}

function ScrollStateFooter() {
  const scrollable = useMessageScrollerScrollable();

  return (
    <CardFooter class="justify-center border-t text-center text-sm text-muted-foreground">
      {getScrollStatus(scrollable().start, scrollable().end)}
    </CardFooter>
  );
}

export default function MessageScrollerScrollable() {
  return (
    <div class="mx-auto flex w-full max-w-sm flex-col gap-4">
      <Card class="h-140 w-full gap-0 overflow-hidden">
        <CardHeader class="gap-1 border-b">
          <CardTitle>Scroll Status</CardTitle>
          <CardDescription>
            Where the reader can scroll to based on current scroll position.
          </CardDescription>
        </CardHeader>
        <MessageScrollerProvider defaultScrollPosition="start">
          <CardContent class="flex-1 overflow-hidden p-0">
            <MessageScroller>
              <MessageScrollerViewport>
                <MessageScrollerContent class="gap-4 p-(--card-spacing)">
                  <For each={messages}>
                    {(message) => {
                      const isUser = message.role === "user";
                      return (
                        <MessageScrollerItem
                          messageId={message.id}
                          scrollAnchor={isUser}
                        >
                          <Message align={isUser ? "end" : "start"}>
                            <MessageContent>
                              <Bubble variant={isUser ? "muted" : "ghost"}>
                                <BubbleContent class="space-y-2">
                                  <For each={paragraphsOf(message.text)}>
                                    {(paragraph) => (
                                      <p class="whitespace-pre-wrap">
                                        {paragraph}
                                      </p>
                                    )}
                                  </For>
                                </BubbleContent>
                              </Bubble>
                            </MessageContent>
                          </Message>
                        </MessageScrollerItem>
                      );
                    }}
                  </For>
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </CardContent>
          <ScrollStateFooter />
        </MessageScrollerProvider>
      </Card>
      <div class="px-0.5 text-center text-xs text-muted-foreground">
        Scroll the transcript to see the footer update.
      </div>
    </div>
  );
}
