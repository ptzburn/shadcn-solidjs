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
  AttachmentTrigger,
} from "~/registry/ui/attachment.tsx";
import { For } from "solid-js";

const images = [
  { name: "workspace.png", meta: "PNG · 820 KB", seed: "workspace" },
  { name: "desk-reference.jpg", meta: "JPG · 1.1 MB", seed: "desk" },
  { name: "office-reference.jpg", meta: "JPG · 940 KB", seed: "office" },
];

export default function AttachmentImage() {
  return (
    <div class="mx-auto w-full max-w-sm py-12">
      <AttachmentGroup class="w-full">
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
              <AttachmentActions>
                <AttachmentAction aria-label={`Remove ${image.name}`}>
                  <IconPlaceholder
                    lucide="x"
                    tabler="x"
                    ph="x"
                    ri="close-line"
                    hugeicons="cancel-01"
                  />
                </AttachmentAction>
              </AttachmentActions>
              <AttachmentTrigger
                as="a"
                href={`https://avatar.vercel.sh/${image.seed}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${image.name}`}
              />
            </Attachment>
          )}
        </For>
      </AttachmentGroup>
    </div>
  );
}
