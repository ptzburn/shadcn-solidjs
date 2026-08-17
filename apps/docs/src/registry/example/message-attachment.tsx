import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "~/registry/ui/attachment.tsx";
import { Bubble, BubbleContent } from "~/registry/ui/bubble.tsx";
import { Message, MessageContent } from "~/registry/ui/message.tsx";

export default function MessageAttachmentDemo() {
  return (
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <Message align="end">
        <MessageContent>
          <Attachment orientation="vertical">
            <AttachmentMedia variant="image">
              <img src="https://avatar.vercel.sh/workspace" alt="Workspace" />
            </AttachmentMedia>
          </Attachment>
          <Bubble>
            <BubbleContent>
              Here's the image. Can you add it to the PDF? Use it for the cover
              page.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>
              Done. Here's the PDF with the image added as the cover page.
            </BubbleContent>
          </Bubble>
          <Attachment>
            <AttachmentMedia>
              <IconPlaceholder
                lucide="file-text"
                tabler="file-text"
                ph="file-text"
                ri="file-text-line"
                hugeicons="file-02"
              />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
              <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction
                type="button"
                title="Download"
                aria-label="Download"
                size="icon-sm"
                variant="secondary"
              >
                <IconPlaceholder
                  lucide="download"
                  tabler="download"
                  ph="download-simple"
                  ri="download-line"
                  hugeicons="download-01"
                />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>Thanks. Looks good.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </div>
  );
}
