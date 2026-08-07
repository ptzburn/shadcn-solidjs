import { For } from "solid-js";

import { Bubble, BubbleContent } from "~/registry/ui/bubble.tsx";
import { Button } from "~/registry/ui/button.tsx";
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
  useMessageScroller,
} from "~/registry/ui/message-scroller.tsx";

const messages = Array.from({ length: 16 }, (_, index) => ({
  id: `command-${index + 1}`,
  role: (index % 2 === 0 ? "user" : "assistant") as "user" | "assistant",
  text: index % 2 === 0
    ? `Question ${index / 2 + 1}: what changed in the funnel this week?`
    : `Answer ${
      Math.ceil(index / 2)
    }. Workspace creation is up, invite completion is flat, and the gap between the two is where the drop-off sits.`,
}));

const jumpTargets = [
  { id: "command-1", label: "First question" },
  { id: "command-9", label: "Middle of the thread" },
  { id: "command-15", label: "Last question" },
];

function JumpControls() {
  const { scrollToEnd, scrollToMessage, scrollToStart } = useMessageScroller();

  return (
    <CardFooter class="flex-wrap justify-center gap-2 border-t">
      <Button variant="outline" size="xs" onClick={() => scrollToStart()}>
        Start
      </Button>
      <For each={jumpTargets}>
        {(target) => (
          <Button
            variant="outline"
            size="xs"
            onClick={() => scrollToMessage(target.id, { align: "start" })}
          >
            {target.label}
          </Button>
        )}
      </For>
      <Button variant="outline" size="xs" onClick={() => scrollToEnd()}>
        End
      </Button>
    </CardFooter>
  );
}

export default function MessageScrollerCommands() {
  return (
    <Card class="mx-auto h-140 w-full max-w-sm gap-0 overflow-hidden">
      <CardHeader class="gap-1 border-b">
        <CardTitle>Scroll Commands</CardTitle>
        <CardDescription>
          Jump anywhere in the transcript with `useMessageScroller`.
        </CardDescription>
      </CardHeader>
      <MessageScrollerProvider defaultScrollPosition="start">
        <CardContent class="flex-1 overflow-hidden p-0">
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent class="gap-4 p-(--card-spacing)">
                <For each={messages}>
                  {(message) => (
                    <MessageScrollerItem
                      messageId={message.id}
                      scrollAnchor={message.role === "user"}
                    >
                      <Message
                        align={message.role === "user" ? "end" : "start"}
                      >
                        <MessageContent>
                          <Bubble
                            variant={message.role === "user"
                              ? "muted"
                              : "ghost"}
                          >
                            <BubbleContent>{message.text}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  )}
                </For>
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </CardContent>
        <JumpControls />
      </MessageScrollerProvider>
    </Card>
  );
}
