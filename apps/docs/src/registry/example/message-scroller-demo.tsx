import { createSignal, For, onCleanup, Show } from "solid-js";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Bubble, BubbleContent } from "~/registry/ui/bubble.tsx";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/registry/ui/empty.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "~/registry/ui/input-group.tsx";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/registry/ui/tooltip.tsx";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

// The scripted transcript upstream builds with createChat(). The demo is read
// only: pressing send replays the next queued turn.
const script: ChatMessage[] = [
  {
    id: "demo-1",
    role: "user",
    text:
      "I'm building a chat for our app and the scroll behavior is driving me nuts. Every time the AI streams a reply, the whole thread jumps around.",
  },
  {
    id: "demo-2",
    role: "assistant",
    text:
      "That's the classic streaming scroll problem. Wrap your message list in `MessageScroller` and turn on `autoScroll` — the viewport pins to the bottom as tokens arrive, so users always see the latest text land in place.\n\nThe important part: it only auto-scrolls while the reader is already at the bottom. The moment they scroll up to read something earlier, auto-scroll backs off and their position is preserved. You get smooth streaming without fighting the user's intent.",
  },
  {
    id: "demo-3",
    role: "user",
    text:
      "Okay, but when someone sends a new message the view still feels jarring — like the whole conversation reloads from the top.",
  },
  {
    id: "demo-4",
    role: "assistant",
    text:
      "MessageScrollerItem fixes that with turn anchoring. Set `scrollAnchor` on the turn that should settle near the top instead of blindly snapping to the document bottom.\n\nIt also leaves a small peek of the previous exchange visible above the anchor, so context isn't lost. The reply starts in view without that disorienting jump you get from a plain overflow container.",
  },
  {
    id: "demo-5",
    role: "user",
    text:
      "And if they've scrolled up to re-read an older answer? I don't want to yank them back down.",
  },
  {
    id: "demo-6",
    role: "assistant",
    text:
      "You won't. Auto-scroll only runs when the viewport is already pinned to the bottom, so scrolling up is a deliberate opt-out — their place in the thread stays put even as new tokens keep arriving below.\n\nWhen there is content they haven't seen yet, `MessageScrollerButton` appears at the bottom of the viewport. One tap jumps them back to the newest message and re-engages auto-scroll. Same pattern as Slack or iMessage: quiet when you're caught up, helpful when you're not.",
  },
  {
    id: "demo-7",
    role: "user",
    text: "Last one — does this work with assistive tech?",
  },
  {
    id: "demo-8",
    role: "assistant",
    text:
      '`MessageScrollerContent` sets `role="log"` and `aria-relevant="additions"` by default, so screen readers announce new messages as they stream in.\n\nThe scroll button is a real `<button>` with an sr-only label, and it\'s removed from the tab order when you\'re already at the bottom — no ghost focus stops.',
  },
];

const paragraphsOf = (text: string) =>
  text.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);

function MessageRow(props: { message: ChatMessage }) {
  const isUser = () => props.message.role === "user";
  return (
    <MessageScrollerItem
      messageId={props.message.id}
      scrollAnchor={isUser()}
      // Upstream animates the user row in with motion; tw-animate-css gets
      // the same slide-up entrance without the dependency.
      class={isUser() ? "animate-in fade-in slide-in-from-bottom-4" : undefined}
    >
      <Message align={isUser() ? "end" : "start"}>
        <MessageContent>
          <Bubble variant={isUser() ? "muted" : "ghost"}>
            <BubbleContent class="space-y-2">
              <For each={paragraphsOf(props.message.text)}>
                {(paragraph) => <p class="whitespace-pre-wrap">{paragraph}</p>}
              </For>
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageScrollerItem>
  );
}

export default function MessageScrollerDemo() {
  // Opens empty, like upstream's chat.get(0).
  const [messages, setMessages] = createSignal<ChatMessage[]>([]);
  const [busy, setBusy] = createSignal(false);

  let timer: ReturnType<typeof setInterval> | undefined;
  onCleanup(() => clearInterval(timer));

  // The composer only ever previews the next user turn, never an assistant
  // reply — upstream's chat.next() is findNextUserTurn().
  const nextMessage = () =>
    script.slice(messages().length).find((message) =>
      message.role === "user"
    ) ?? null;

  // Stands in for the ai-sdk transport: sending a user turn appends it and
  // then streams the assistant turn that follows it in the script.
  const send = (event: SubmitEvent) => {
    event.preventDefault();
    const next = nextMessage();
    if (!next || busy()) return;

    const reply = script[script.indexOf(next) + 1];
    setMessages((current) => [...current, next]);
    if (reply?.role !== "assistant") return;

    setBusy(true);
    setMessages((current) => [...current, { ...reply, text: "" }]);
    const words = reply.text.split(" ");
    let index = 0;
    timer = setInterval(() => {
      index += 3;
      const text = words.slice(0, index).join(" ");
      setMessages((current) =>
        current.map((message) =>
          message.id === reply.id ? { ...message, text } : message
        )
      );
      if (index >= words.length) {
        clearInterval(timer);
        setBusy(false);
      }
    }, 20);
  };

  const reset = () => {
    clearInterval(timer);
    setBusy(false);
    setMessages([]);
  };

  return (
    <MessageScrollerProvider autoScroll>
      <div class="relative flex flex-col gap-4">
        <Card class="mx-auto h-140 w-full max-w-sm gap-0">
          <CardHeader class="gap-1 border-b">
            <CardTitle>New Chat</CardTitle>
            <CardDescription>How can I help you today?</CardDescription>
            <CardAction>
              <Tooltip>
                <TooltipTrigger
                  as={Button<"button">}
                  variant="outline"
                  size="icon"
                  aria-label="Reset conversation"
                  onClick={reset}
                  disabled={busy()}
                >
                  <IconPlaceholder
                    lucide="rotate-cw"
                    tabler="rotate"
                    ph="arrow-clockwise"
                    ri="refresh-line"
                    hugeicons="refresh"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset</p>
                </TooltipContent>
              </Tooltip>
            </CardAction>
          </CardHeader>
          <CardContent class="flex-1 overflow-hidden p-0">
            <Show
              when={messages().length > 0}
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
                    <EmptyTitle>Morning, shadcn!</EmptyTitle>
                    <EmptyDescription>
                      What are we working on today? Press send to start a new
                      conversation
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              }
            >
              <MessageScroller>
                <MessageScrollerViewport>
                  <MessageScrollerContent
                    aria-busy={busy()}
                    class="p-(--card-spacing)"
                  >
                    <For each={messages()}>
                      {(message) => <MessageRow message={message} />}
                    </For>
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            </Show>
          </CardContent>
          <CardFooter class="flex-col gap-2">
            <form onSubmit={send} class="w-full">
              <InputGroup>
                <div class="h-14 w-full px-3 py-2.5">
                  <span
                    class="line-clamp-2 opacity-60 data-[status=ready]:opacity-100"
                    data-status={busy() ? "streaming" : "ready"}
                  >
                    <Show
                      when={nextMessage()}
                      fallback={
                        <span class="text-muted-foreground">
                          No messages queued. Reset the conversation.
                        </span>
                      }
                    >
                      {(message) => message().text}
                    </Show>
                  </span>
                </div>
                <InputGroupAddon align="block-end" class="pt-1">
                  <DropdownMenu placement="top-start">
                    <DropdownMenuTrigger
                      as={InputGroupButton}
                      aria-label="Add files"
                      type="button"
                      size="icon-sm"
                      variant="outline"
                    >
                      <IconPlaceholder
                        lucide="plus"
                        tabler="plus"
                        ph="plus"
                        ri="add-line"
                        hugeicons="plus-sign"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="w-44">
                      <DropdownMenuItem>
                        <IconPlaceholder
                          lucide="paperclip"
                          tabler="paperclip"
                          ph="paperclip"
                          ri="attachment-line"
                          hugeicons="attachment-01"
                        />
                        Add Photos &amp; Files
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <IconPlaceholder
                          lucide="image"
                          tabler="photo"
                          ph="image"
                          ri="image-line"
                          hugeicons="image-01"
                        />
                        Create Image
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <IconPlaceholder
                          lucide="telescope"
                          tabler="telescope"
                          ph="binoculars"
                          ri="search-eye-line"
                          hugeicons="telescope-01"
                        />
                        Deep Research
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <IconPlaceholder
                          lucide="globe"
                          tabler="world"
                          ph="globe"
                          ri="global-line"
                          hugeicons="globe"
                        />
                        Web Search
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <InputGroupButton
                    type="submit"
                    variant="default"
                    size="icon-sm"
                    disabled={!nextMessage() || busy()}
                    class="ml-auto"
                  >
                    <IconPlaceholder
                      lucide="arrow-up"
                      tabler="arrow-up"
                      ph="arrow-up"
                      ri="arrow-up-line"
                      hugeicons="arrow-up-02"
                    />
                    <span class="sr-only">Send</span>
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </form>
          </CardFooter>
        </Card>
        <div class="px-0.5 text-center text-xs text-muted-foreground">
          Demo is read only. Press send to send messages.
        </div>
      </div>
    </MessageScrollerProvider>
  );
}
