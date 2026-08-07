import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";

export default function DropdownMenuDestructive() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger as={Button<"button">} variant="outline">
        Actions
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="pencil"
              tabler="pencil"
              ph="pencil"
              ri="pencil-line"
              hugeicons="edit-02"
            />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="share"
              tabler="share"
              ph="share"
              ri="share-line"
              hugeicons="share-03"
            />
            Share
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">
            <IconPlaceholder
              lucide="trash"
              tabler="trash"
              ph="trash"
              ri="delete-bin-line"
              hugeicons="delete-02"
            />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
