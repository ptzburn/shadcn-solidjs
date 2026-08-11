import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "~/registry/ui/context-menu.tsx";

export default function ContextMenuIcons() {
  return (
    <ContextMenu>
      <ContextMenuTrigger class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
        <span class="hidden pointer-fine:inline-block">
          Right click here
        </span>
        <span class="hidden pointer-coarse:inline-block">
          Long press here
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>
            <IconPlaceholder
              lucide="copy"
              tabler="copy"
              ph="copy"
              ri="file-copy-line"
              hugeicons="copy-01"
            />
            Copy
          </ContextMenuItem>
          <ContextMenuItem>
            <IconPlaceholder
              lucide="scissors"
              tabler="scissors"
              ph="scissors"
              ri="scissors-line"
              hugeicons="scissor-01"
            />
            Cut
          </ContextMenuItem>
          <ContextMenuItem>
            <IconPlaceholder
              lucide="clipboard-paste"
              tabler="clipboard"
              ph="clipboard-text"
              ri="clipboard-line"
              hugeicons="clipboard"
            />
            Paste
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem variant="destructive">
            <IconPlaceholder
              lucide="trash"
              tabler="trash"
              ph="trash"
              ri="delete-bin-line"
              hugeicons="delete-02"
            />
            Delete
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
