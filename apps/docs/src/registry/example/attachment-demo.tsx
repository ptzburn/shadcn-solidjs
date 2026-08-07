import { For } from "solid-js";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "~/registry/ui/attachment.tsx";
import { Spinner } from "~/registry/ui/spinner.tsx";

const images = [
  { name: "workspace.png", meta: "PNG · 820 KB", seed: "workspace" },
  { name: "desk-reference.jpg", meta: "JPG · 1.1 MB", seed: "desk" },
  { name: "office-reference.jpg", meta: "JPG · 940 KB", seed: "office" },
];

export default function AttachmentDemo() {
  return (
    <div class="mx-auto flex w-full max-w-sm flex-col gap-3 py-12">
      <AttachmentGroup>
        <For each={images}>
          {(image) => (
            <Attachment orientation="vertical">
              <AttachmentMedia variant="image">
                <img
                  src={`https://avatar.vercel.sh/${image.seed}`}
                  alt={image.name}
                />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>{image.name}</AttachmentTitle>
                <AttachmentDescription>{image.meta}</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
          )}
        </For>
      </AttachmentGroup>
      <Attachment state="uploading" class="w-full">
        <AttachmentMedia>
          <Spinner />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
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
      <Attachment class="w-full">
        <AttachmentMedia>
          <IconPlaceholder
            lucide="file-code"
            tabler="file-code"
            ph="file-code"
            ri="file-code-line"
            hugeicons="file-code"
          />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>message-renderer.tsx</AttachmentTitle>
          <AttachmentDescription>TypeScript · 12 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove message-renderer.tsx">
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
