import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "~/registry/ui/attachment.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/registry/ui/dialog.tsx";

export default function AttachmentTriggerDemo() {
  return (
    <div class="mx-auto w-full max-w-sm py-12">
      <Dialog>
        <Attachment class="w-full">
          <AttachmentMedia>
            <IconPlaceholder
              lucide="file-search"
              tabler="file-search"
              ph="file-search"
              ri="file-search-line"
              hugeicons="file-search"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>research-summary.pdf</AttachmentTitle>
            <AttachmentDescription>Open preview dialog</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Copy link">
              <IconPlaceholder
                lucide="copy"
                tabler="copy"
                ph="copy"
                ri="file-copy-line"
                hugeicons="copy-01"
              />
            </AttachmentAction>
            <AttachmentAction aria-label="Remove research-summary.pdf">
              <IconPlaceholder
                lucide="x"
                tabler="x"
                ph="x"
                ri="close-line"
                hugeicons="cancel-01"
              />
            </AttachmentAction>
          </AttachmentActions>
          <DialogTrigger
            as={AttachmentTrigger}
            aria-label="Preview research-summary.pdf"
          />
        </Attachment>
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>research-summary.pdf</DialogTitle>
            <DialogDescription>
              The attachment trigger fills the card and opens the dialog, while
              the actions stay independently clickable above it.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
