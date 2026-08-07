import type { JSX } from "solid-js";
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

interface Item {
  name: string;
  meta: string;
  media: () => JSX.Element;
}

const items: Item[] = [
  {
    name: "briefing-notes.pdf",
    meta: "PDF · 1.4 MB",
    media: () => (
      <AttachmentMedia>
        <IconPlaceholder
          lucide="file-text"
          tabler="file-text"
          ph="file-text"
          ri="file-text-line"
          hugeicons="file-02"
        />
      </AttachmentMedia>
    ),
  },
  {
    name: "workspace.png",
    meta: "PNG · 820 KB",
    media: () => (
      <AttachmentMedia variant="image">
        <img src="https://avatar.vercel.sh/workspace" alt="workspace.png" />
      </AttachmentMedia>
    ),
  },
  {
    name: "customers.csv",
    meta: "CSV · 18 KB",
    media: () => (
      <AttachmentMedia>
        <IconPlaceholder
          lucide="table"
          tabler="table"
          ph="table"
          ri="table-line"
          hugeicons="table"
        />
      </AttachmentMedia>
    ),
  },
  {
    name: "renderer.tsx",
    meta: "TSX · 12 KB",
    media: () => (
      <AttachmentMedia>
        <IconPlaceholder
          lucide="file-code"
          tabler="file-code"
          ph="file-code"
          ri="file-code-line"
          hugeicons="file-code"
        />
      </AttachmentMedia>
    ),
  },
];

export default function AttachmentGroupDemo() {
  return (
    <div class="mx-auto w-full max-w-sm py-12">
      <AttachmentGroup class="w-full">
        <For each={items}>
          {(item) => (
            <Attachment class="w-64">
              {item.media()}
              <AttachmentContent>
                <AttachmentTitle>{item.name}</AttachmentTitle>
                <AttachmentDescription>{item.meta}</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction aria-label={`Remove ${item.name}`}>
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
          )}
        </For>
      </AttachmentGroup>
    </div>
  );
}
