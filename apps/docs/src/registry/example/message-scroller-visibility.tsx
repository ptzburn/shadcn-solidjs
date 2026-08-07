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
  useMessageScrollerVisibility,
} from "~/registry/ui/message-scroller.tsx";

const turns = [
  { id: "visibility-1", title: "Funnel overview" },
  { id: "visibility-3", title: "Invite drop-off" },
  { id: "visibility-5", title: "Template segments" },
  { id: "visibility-7", title: "Next experiment" },
];

const messages = Array.from({ length: 8 }, (_, index) => {
  const role = (index % 2 === 0 ? "user" : "assistant") as
    | "user"
    | "assistant";
  const turn = turns[Math.floor(index / 2)];
  return {
    id: `visibility-${index + 1}`,
    role,
    text: role === "user"
      ? `${turn.title}: can you walk me through it?`
      : `${turn.title} holds up. Workspace creation is up 8% while invite completion is flat, so the gap sits at the collaboration step rather than at signup.\n\nThe segments that skip invites still return within a day, which suggests the prompt is mistimed rather than unwanted.`,
  };
});

function VisibilityFooter() {
  const visibility = useMessageScrollerVisibility();

  const currentTurn = () =>
    turns.find((turn) => turn.id === visibility().currentAnchorId)?.title ??
      "None";

  return (
    <CardFooter class="flex-col items-start gap-1 border-t text-xs text-muted-foreground">
      <div>
        Current turn:{" "}
        <span class="font-medium text-foreground">{currentTurn()}</span>
      </div>
      <div>
        On screen:{" "}
        <span class="font-medium text-foreground">
          {visibility().visibleMessageIds.length} of {messages.length}
        </span>
      </div>
    </CardFooter>
  );
}

export default function MessageScrollerVisibility() {
  return (
    <Card class="mx-auto h-140 w-full max-w-sm gap-0 overflow-hidden">
      <CardHeader class="gap-1 border-b">
        <CardTitle>Reader Position</CardTitle>
        <CardDescription>
          Scroll the transcript to see the anchored turn update.
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
                            <BubbleContent class="whitespace-pre-line">
                              {message.text}
                            </BubbleContent>
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
        <VisibilityFooter />
      </MessageScrollerProvider>
    </Card>
  );
}
