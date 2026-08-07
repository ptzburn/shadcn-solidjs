import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "~/registry/ui/attachment.tsx";

export default function AttachmentSizes() {
  return (
    <div class="mx-auto flex w-full max-w-sm flex-col gap-3 py-12">
      <Attachment size="default" class="w-full">
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
          <AttachmentTitle>Default attachment</AttachmentTitle>
          <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment size="sm" class="w-full">
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
          <AttachmentTitle>Small attachment</AttachmentTitle>
          <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment size="xs" class="w-full">
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
          <AttachmentTitle>Extra small attachment</AttachmentTitle>
        </AttachmentContent>
      </Attachment>
    </div>
  );
}
