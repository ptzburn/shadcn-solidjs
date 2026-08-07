import { createSignal, For, onCleanup } from "solid-js";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Bubble, BubbleContent } from "~/registry/ui/bubble.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/registry/ui/card.tsx";
import { Marker, MarkerContent, MarkerIcon } from "~/registry/ui/marker.tsx";
import { Message, MessageContent } from "~/registry/ui/message.tsx";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "~/registry/ui/message-scroller.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/registry/ui/input-group.tsx";
import { Spinner } from "~/registry/ui/spinner.tsx";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const seed: ChatMessage[] = [
  {
    id: "seed-1",
    role: "user",
    text: "Why did activation dip last week?",
  },
  {
    id: "seed-2",
    role: "assistant",
    text:
      "Workspace creation rose 8%, but first invite completion only rose 2%.\n\nTeams are creating workspaces and then stopping before they add collaborators, so the activation funnel narrows at the invite step rather than at signup.",
  },
];

const reply =
  "Start with the invite step. Teams are creating workspaces but waiting to add collaborators.\n\nRecommended follow-up:\n\n1. Compare invite drop-off by account size.\n2. Check whether users who skip invites still return within 24 hours.\n3. Review the empty-state copy on the first project screen.\n\nIf that pattern holds, the next experiment should make collaboration useful earlier instead of prompting for invites harder.";

export default function MessageScrollerDemo() {
  const [messages, setMessages] = createSignal<ChatMessage[]>(seed);
  const [input, setInput] = createSignal("");
  const [streaming, setStreaming] = createSignal(false);

  let timer: ReturnType<typeof setInterval> | undefined;
  onCleanup(() => clearInterval(timer));

  // Stands in for a real streaming transport: appends the reply a few words at
  // a time so the viewport has something to follow.
  const streamReply = (id: string) => {
    const words = reply.split(" ");
    let index = 0;
    setStreaming(true);
    timer = setInterval(() => {
      index += 3;
      const text = words.slice(0, index).join(" ");
      setMessages((current) =>
        current.map((message) =>
          message.id === id ? { ...message, text } : message
        )
      );
      if (index >= words.length) {
        clearInterval(timer);
        setStreaming(false);
      }
    }, 90);
  };

  const send = (event: SubmitEvent) => {
    event.preventDefault();
    const text = input().trim();
    if (!text || streaming()) return;

    const turn = messages().length + 1;
    const replyId = `assistant-${turn}`;
    setInput("");
    setMessages((current) => [
      ...current,
      { id: `user-${turn}`, role: "user", text },
      { id: replyId, role: "assistant", text: "" },
    ]);
    streamReply(replyId);
  };

  return (
    <Card class="mx-auto h-140 w-full max-w-sm gap-0 overflow-hidden">
      <CardHeader class="gap-1 border-b">
        <CardTitle>Activation review</CardTitle>
        <CardDescription>
          Send a message to watch the new turn anchor near the top.
        </CardDescription>
      </CardHeader>
      <MessageScrollerProvider autoScroll defaultScrollPosition="last-anchor">
        <CardContent class="flex-1 overflow-hidden p-0">
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent class="p-(--card-spacing)">
                <For each={messages()}>
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
                <MessageScrollerItem>
                  <Marker role="status" class={streaming() ? "" : "hidden"}>
                    <MarkerIcon>
                      <Spinner />
                    </MarkerIcon>
                    <MarkerContent class="shimmer">Thinking...</MarkerContent>
                  </Marker>
                </MessageScrollerItem>
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </CardContent>
      </MessageScrollerProvider>
      <CardFooter class="border-t">
        <form class="w-full" onSubmit={send}>
          <InputGroup>
            <InputGroupInput
              placeholder="Ask a follow-up..."
              value={input()}
              onInput={(event) => setInput(event.currentTarget.value)}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="submit"
                size="icon-xs"
                aria-label="Send"
                disabled={streaming()}
              >
                <IconPlaceholder
                  lucide="arrow-up"
                  tabler="arrow-up"
                  ph="arrow-up"
                  ri="arrow-up-line"
                  hugeicons="arrow-up-02"
                />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </CardFooter>
    </Card>
  );
}
