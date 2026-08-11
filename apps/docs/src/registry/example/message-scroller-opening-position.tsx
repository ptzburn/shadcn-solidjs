import { Bubble, BubbleContent } from "~/registry/ui/bubble.tsx";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/registry/ui/card.tsx";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from "~/registry/ui/message-scroller.tsx";
import { Message, MessageContent } from "~/registry/ui/message.tsx";
import { Tabs, TabsList, TabsTrigger } from "~/registry/ui/tabs.tsx";
import { createEffect, createSignal, For, onCleanup } from "solid-js";

type Position = "start" | "end" | "last-anchor";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const messages: ChatMessage[] = [
  {
    id: "open-1",
    role: "user",
    text: "This is the first message the user sent in the conversation.",
  },
  {
    id: "open-2",
    role: "assistant",
    text:
      "Workspace creation rose 8%, but first invite completion only rose 2%.",
  },
  {
    id: "open-3",
    role: "user",
    text: "This is the last message the user sent in the conversation.",
  },
  {
    id: "open-4",
    role: "assistant",
    text:
      "Start with the invite step. Teams are creating workspaces but waiting to add collaborators.\n\nRecommended follow-up:\n\n1. Compare invite drop-off by account size.\n2. Check whether users who skip invites still return within 24 hours.\n3. Review the empty-state copy on the first project screen.\n4. Segment activation by template, since template users may not need invites right away.\n\nIf that pattern holds, the next experiment should make collaboration useful earlier instead of prompting for invites harder.",
  },
];

const positions: Position[] = ["start", "end", "last-anchor"];

const paragraphsOf = (text: string) =>
  text.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);

function OpeningPositionScroller(props: { position: Position }) {
  const { scrollToEnd, scrollToMessage, scrollToStart } = useMessageScroller();

  // The opening scroll only runs once per transcript, so replay it whenever
  // the reader picks a different position.
  createEffect(() => {
    const position = props.position;
    const frame = requestAnimationFrame(() => {
      if (position === "start") {
        scrollToStart({ behavior: "auto" });
        return;
      }
      if (position === "end") {
        scrollToEnd({ behavior: "auto" });
        return;
      }
      scrollToMessage("open-3", {
        align: "start",
        behavior: "auto",
        scrollMargin: 64,
      });
    });
    onCleanup(() => cancelAnimationFrame(frame));
  });

  return (
    <MessageScroller>
      <MessageScrollerViewport>
        <MessageScrollerContent class="p-(--card-spacing)">
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
                              <p class="whitespace-pre-wrap">{paragraph}</p>
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
  );
}

export default function MessageScrollerOpeningPosition() {
  const [position, setPosition] = createSignal<Position>("last-anchor");

  return (
    <div class="relative flex flex-col gap-4">
      <Card class="mx-auto h-140 w-full max-w-sm gap-0">
        <CardHeader class="gap-1 border-b">
          <CardTitle>Opening Position</CardTitle>
          <CardDescription>
            Choose where a saved transcript opens.
          </CardDescription>
        </CardHeader>
        <CardContent class="flex-1 overflow-hidden p-0">
          <MessageScrollerProvider>
            <OpeningPositionScroller position={position()} />
          </MessageScrollerProvider>
        </CardContent>
        <CardFooter class="flex items-center justify-center border-t">
          <Tabs
            value={position()}
            onChange={(value) => setPosition(value as Position)}
            class="w-full"
          >
            <TabsList class="w-full">
              <For each={positions}>
                {(option) => <TabsTrigger value={option}>{option}</TabsTrigger>}
              </For>
            </TabsList>
          </Tabs>
        </CardFooter>
      </Card>
      <div class="mx-auto max-w-sm px-0.5 text-center text-muted-foreground text-xs">
        Toggle the defaultScrollPosition to see where the transcript starts when
        you open the thread
      </div>
    </div>
  );
}
