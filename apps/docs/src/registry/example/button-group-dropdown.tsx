import {
  IconAlertTriangle,
  IconCheck,
  IconChevronDown,
  IconCopy,
  IconShare,
  IconTrash,
  IconUserX,
  IconVolumeOff,
} from "~/components/icons.tsx";

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
          <IconChevronDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-44">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <IconVolumeOff />
              Mute Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconCheck />
              Mark as Read
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconAlertTriangle />
              Report Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconUserX />
              Block User
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconShare />
              Share Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconCopy />
              Copy Conversation
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <IconTrash />
              Delete Conversation
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
