import { createSignal } from "solid-js";

import {
  IconArchive,
  IconArrowLeft,
  IconCalendarPlus,
  IconClock,
  IconDots,
  IconFilter,
  IconMailCheck,
  IconTag,
  IconTrash,
} from "~/components/icons.tsx";

import { Button } from "~/registry/ui/button.tsx";
import { ButtonGroup } from "~/registry/ui/button-group.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";

export default function ButtonGroupDemo() {
  const [label, setLabel] = createSignal("personal");

  return (
    <ButtonGroup>
      <ButtonGroup class="hidden sm:flex">
        <Button variant="outline" size="icon" aria-label="Go Back">
          <IconArrowLeft />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Archive</Button>
        <Button variant="outline">Report</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Snooze</Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            as={Button<"button">}
            variant="outline"
            size="icon"
            aria-label="More Options"
          >
            <IconDots />
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-44">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconMailCheck />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconArchive />
                Archive
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconClock />
                Snooze
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCalendarPlus />
                Add to Calendar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconFilter />
                Add to List
              </DropdownMenuItem>
              <DropdownMenuSub overlap>
                <DropdownMenuSubTrigger>
                  <IconTag />
                  Label As...
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={label()} onChange={setLabel}>
                      <DropdownMenuRadioItem value="personal">
                        Personal
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="work">
                        Work
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="other">
                        Other
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <IconTrash />
                Trash
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
  );
}
