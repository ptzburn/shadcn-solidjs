import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { ButtonGroup } from "~/registry/ui/button-group.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";

export default function ButtonGroupDropdown() {
  return (
    <ButtonGroup>
      <Button variant="outline">Follow</Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          as={Button<"button">}
          variant="outline"
          class="pl-2!"
        >
          <IconPlaceholder
            lucide="chevron-down"
            tabler="chevron-down"
            ph="caret-down"
            ri="arrow-down-s-line"
            hugeicons="arrow-down-01"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-44">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="volume-off"
                tabler="volume-off"
                ph="speaker-slash"
                ri="volume-mute-line"
                hugeicons="volume-off"
              />
              Mute Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="check"
                tabler="check"
                ph="check"
                ri="check-line"
                hugeicons="tick-02"
              />
              Mark as Read
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="triangle-alert"
                tabler="alert-triangle"
                ph="warning"
                ri="alert-line"
                hugeicons="alert-02"
              />
              Report Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="user-round-x"
                tabler="user-x"
                ph="user-minus"
                ri="user-unfollow-line"
                hugeicons="user-remove-01"
              />
              Block User
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="share"
                tabler="share"
                ph="share"
                ri="share-line"
                hugeicons="share-03"
              />
              Share Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="copy"
                tabler="copy"
                ph="copy"
                ri="file-copy-line"
                hugeicons="copy-01"
              />
              Copy Conversation
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <IconPlaceholder
                lucide="trash-2"
                tabler="trash"
                ph="trash"
                ri="delete-bin-line"
                hugeicons="delete-02"
              />
              Delete Conversation
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
