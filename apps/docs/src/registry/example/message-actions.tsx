import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Bubble, BubbleContent } from "~/registry/ui/bubble.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  Message,
  MessageContent,
  MessageFooter,
} from "~/registry/ui/message.tsx";

export default function MessageActionsDemo() {
  return (
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <Message>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>
              The install failure is coming from the workspace package.
            </BubbleContent>
          </Bubble>
          <MessageFooter>
            <Button variant="ghost" size="icon" aria-label="Copy" title="Copy">
              <IconPlaceholder
                lucide="copy"
                tabler="copy"
                ph="copy"
                ri="file-copy-line"
                hugeicons="copy-01"
              />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Like" title="Like">
              <IconPlaceholder
                lucide="thumbs-up"
                tabler="thumb-up"
                ph="thumbs-up"
                ri="thumb-up-line"
                hugeicons="thumbs-up"
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Dislike"
              title="Dislike"
            >
              <IconPlaceholder
                lucide="thumbs-down"
                tabler="thumb-down"
                ph="thumbs-down"
                ri="thumb-down-line"
                hugeicons="thumbs-down"
              />
            </Button>
          </MessageFooter>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>Okay drop me a link. Taking a look...</BubbleContent>
          </Bubble>
          <MessageFooter class="gap-2">
            <span class="font-normal text-destructive">Failed to send</span>
            <Button
              variant="ghost"
              size="icon-xs"
              title="Retry"
              aria-label="Retry"
            >
              <IconPlaceholder
                lucide="refresh-ccw"
                tabler="refresh"
                ph="arrows-clockwise"
                ri="refresh-line"
                hugeicons="refresh"
              />
            </Button>
          </MessageFooter>
        </MessageContent>
      </Message>
    </div>
  );
}
