import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "~/registry/ui/context-menu.tsx";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

export default function ContextMenuDestructive() {
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
              lucide="pencil"
              tabler="pencil"
              ph="pencil"
              ri="pencil-line"
              hugeicons="edit-02"
            />
            Edit
          </ContextMenuItem>
          <ContextMenuItem>
            <IconPlaceholder
              lucide="share"
              tabler="share"
              ph="share"
              ri="share-line"
              hugeicons="share-03"
            />
            Share
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
