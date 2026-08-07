import { createSignal, For, Show } from "solid-js";

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
} from "~/registry/ui/message-scroller.tsx";
import { Tabs, TabsList, TabsTrigger } from "~/registry/ui/tabs.tsx";

type Position = "start" | "end" | "last-anchor";

const messages = [
  {
    id: "open-1",
    role: "user" as const,
    text: "This is the first message the user sent in the conversation.",
  },
  {
    id: "open-2",
    role: "assistant" as const,
    text:
      "Workspace creation rose 8%, but first invite completion only rose 2%.",
  },
  {
    id: "open-3",
    role: "user" as const,
    text: "This is the last message the user sent in the conversation.",
  },
  {
    id: "open-4",
    role: "assistant" as const,
    text:
      "Start with the invite step. Teams are creating workspaces but waiting to add collaborators.\n\nRecommended follow-up:\n\n1. Compare invite drop-off by account size.\n2. Check whether users who skip invites still return within 24 hours.\n3. Review the empty-state copy on the first project screen.\n4. Segment activation by template, since template users may not need invites right away.\n\nIf that pattern holds, the next experiment should make collaboration useful earlier instead of prompting for invites harder.",
  },
];

const positions: Position[] = ["start", "end", "last-anchor"];

export default function MessageScrollerOpeningPosition() {
  const [position, setPosition] = createSignal<Position>("last-anchor");

  return (
    <Card class="mx-auto h-140 w-full max-w-sm gap-0 overflow-hidden">
      <CardHeader class="gap-1 border-b">
        <CardTitle>Opening Position</CardTitle>
        <CardDescription>
          Choose where a saved transcript opens.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex-1 overflow-hidden p-0">
        {
          /* Keyed on the position so switching tabs remounts the provider and
            replays the opening scroll, which only runs once per transcript. */
        }
        <For each={positions}>
          {(candidate) => (
            <Show when={position() === candidate}>
              <MessageScrollerProvider defaultScrollPosition={candidate}>
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
              </MessageScrollerProvider>
            </Show>
          )}
        </For>
      </CardContent>
      <CardFooter class="justify-center border-t">
        <Tabs
          value={position()}
          onChange={(value) => setPosition(value as Position)}
        >
          <TabsList>
            <For each={positions}>
              {(candidate) => (
                <TabsTrigger value={candidate}>{candidate}</TabsTrigger>
              )}
            </For>
          </TabsList>
        </Tabs>
      </CardFooter>
    </Card>
  );
}
