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
import { Spinner } from "~/registry/ui/spinner.tsx";

export default function AttachmentStates() {
  return (
    <div class="mx-auto flex w-full max-w-sm flex-col gap-2 py-12">
      <Attachment state="idle" class="w-full">
        <AttachmentMedia>
          <IconPlaceholder
            lucide="clock"
            tabler="clock"
            ph="clock"
            ri="time-line"
            hugeicons="clock-01"
          />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>selected-file.pdf</AttachmentTitle>
          <AttachmentDescription>Ready to upload</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove selected-file.pdf">
            <IconPlaceholder
              lucide="x"
              tabler="x"
              ph="x"
              ri="close-line"
              hugeicons="cancel-01"
            />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment state="uploading" class="w-full">
        <AttachmentMedia>
          <Spinner />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>design-system.zip</AttachmentTitle>
          <AttachmentDescription>Uploading · 64%</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Cancel upload">
            <IconPlaceholder
              lucide="x"
              tabler="x"
              ph="x"
              ri="close-line"
              hugeicons="cancel-01"
            />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment state="processing" class="w-full">
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
          <AttachmentTitle>market-research.pdf</AttachmentTitle>
          <AttachmentDescription>Processing document</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove market-research.pdf">
            <IconPlaceholder
              lucide="x"
              tabler="x"
              ph="x"
              ri="close-line"
              hugeicons="cancel-01"
            />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment state="error" class="w-full">
        <AttachmentMedia>
          <IconPlaceholder
            lucide="file-warning"
            tabler="file-alert"
            ph="warning"
            ri="file-warning-line"
            hugeicons="alert-02"
          />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>financial-model.xlsx</AttachmentTitle>
          <AttachmentDescription>
            Upload failed. Try again.
          </AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Retry upload">
            <IconPlaceholder
              lucide="refresh-cw"
              tabler="refresh"
              ph="arrows-clockwise"
              ri="refresh-line"
              hugeicons="refresh"
            />
          </AttachmentAction>
          <AttachmentAction aria-label="Remove financial-model.xlsx">
            <IconPlaceholder
              lucide="x"
              tabler="x"
              ph="x"
              ri="close-line"
              hugeicons="cancel-01"
            />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment state="done" class="w-full">
        <AttachmentMedia>
          <IconPlaceholder
            lucide="check"
            tabler="check"
            ph="check"
            ri="check-line"
            hugeicons="tick-02"
          />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>uploaded-report.pdf</AttachmentTitle>
          <AttachmentDescription>Uploaded · 1.8 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove uploaded-report.pdf">
            <IconPlaceholder
              lucide="x"
              tabler="x"
              ph="x"
              ri="close-line"
              hugeicons="cancel-01"
            />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  );
}
