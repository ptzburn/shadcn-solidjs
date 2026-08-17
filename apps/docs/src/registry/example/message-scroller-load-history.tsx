import { createChat, getMessageText } from "~/lib/ai.ts";
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
import { Marker, MarkerContent } from "~/registry/ui/marker.tsx";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "~/registry/ui/message-scroller.tsx";
import { Message, MessageContent } from "~/registry/ui/message.tsx";
import { toast } from "~/registry/ui/toast.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/registry/ui/tooltip.tsx";
import { createMemo, createSignal, For, Show } from "solid-js";

const chat = createChat()
  .user("Can you summarize the incident channel?")
  .assistant(
    "The first alert was a delayed export job. It started backing up around 09:42 UTC and triggered the warning once the retry queue crossed the threshold.\n\nNo customer-facing checkout paths were affected, but exports for larger workspaces were running about 12 minutes behind.",
  )
  .user("Was checkout affected?")
  .assistant(
    "No checkout errors were reported. Payment authorization, order creation, and confirmation emails stayed inside their normal latency bands.\n\nThe only elevated metric was export queue depth, which maps to analytics downloads instead of checkout.",
  )
  .user("What changed in the last deploy?")
  .assistant(
    "Only the export queue worker changed. The deploy moved large CSV jobs onto the shared retry policy, which made each failed attempt hold a worker slot longer than before.\n\nThe app deploy did not include checkout, pricing, or billing API changes.",
  )
  .user("Do we need to roll back?")
  .assistant(
    "Not yet. Queue depth is recovering after we reduced retry concurrency, and the oldest pending job is now under five minutes old.\n\nKeep rollback ready if the queue starts climbing again, but the current trend points toward recovery.",
  )
  .user("Keep watching for customer-visible issues.")
  .assistant(
    "I will watch the queue and support tags for another 15 minutes. I am tracking export failures, delayed download requests, and any support thread that mentions missing reports.\n\nIf those stay quiet through the next batch window, we can close this as an internal degradation.",
  );

const history = chat.get();
const INITIAL_VISIBLE_COUNT = 5;

const paragraphsOf = (text: string) =>
  text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

export default function MessageScrollerLoadHistory() {
  const [demoKey, setDemoKey] = createSignal(1);
  const [visibleCount, setVisibleCount] = createSignal(INITIAL_VISIBLE_COUNT);
  const visibleMessages = createMemo(() => history.slice(-visibleCount()));
  const canLoadHistory = () => visibleCount() < history.length;

  return (
    <MessageScrollerProvider>
      <div class="relative flex flex-col gap-4">
        <Card class="mx-auto h-140 w-full max-w-sm gap-0">
          <CardHeader class="gap-1 border-b">
            <CardTitle>Load History</CardTitle>
            <CardDescription>
              Prepended messages keep your place.
            </CardDescription>
            <CardAction>
              <Tooltip>
                <TooltipTrigger
                  as={Button<"button">}
                  variant="outline"
                  size="icon"
                  aria-label="Reset loaded messages"
                  disabled={visibleCount() === INITIAL_VISIBLE_COUNT}
                  onClick={() => {
                    setVisibleCount(INITIAL_VISIBLE_COUNT);
                    setDemoKey((key) => key + 1);
                  }}
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
            <Show when={demoKey()} keyed>
              {(_key: number) => (
                <MessageScroller>
                  <MessageScrollerViewport>
                    <MessageScrollerContent class="p-(--card-spacing)">
                      <For each={visibleMessages()}>
                        {(message) => {
                          const isUserMessage = message.role === "user";

                          return (
                            <MessageScrollerItem messageId={message.id}>
                              <Message
                                align={isUserMessage ? "end" : "start"}
                              >
                                <MessageContent>
                                  <Bubble
                                    variant={isUserMessage ? "muted" : "ghost"}
                                  >
                                    <BubbleContent class="space-y-2">
                                      <For
                                        each={paragraphsOf(
                                          getMessageText(message),
                                        )}
                                      >
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
                      <MessageScrollerItem scrollAnchor={false}>
                        <Marker variant="separator">
                          <MarkerContent>End of Conversation</MarkerContent>
                        </Marker>
                      </MessageScrollerItem>
                    </MessageScrollerContent>
                  </MessageScrollerViewport>
                  <MessageScrollerButton />
                </MessageScroller>
              )}
            </Show>
          </CardContent>
          <CardFooter class="flex flex-col items-center gap-2 border-t">
            <Button
              type="button"
              disabled={!canLoadHistory()}
              onClick={() => {
                setVisibleCount(history.length);
                toast.add({
                  title: "History loaded",
                  description: "Scroll up to see earlier messages.",
                });
              }}
              class="w-full"
              variant="secondary"
            >
              {canLoadHistory() ? "Load History" : "History Loaded"}
            </Button>
            <p class="text-muted-foreground text-xs">
              Restore earlier messages while keeping your place.
            </p>
          </CardFooter>
        </Card>
        <div class="mx-auto max-w-sm text-balance px-0.5 text-center text-muted-foreground text-xs">
          Click Load History to load the entire conversation
        </div>
      </div>
    </MessageScrollerProvider>
  );
}
