import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

import { ButtonGroup } from "~/registry/ui/button-group.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";
import { createSignal } from "solid-js";

export default function ButtonGroupDemo() {
  const [label, setLabel] = createSignal("personal");

  return (
    <ButtonGroup>
      <ButtonGroup class="hidden sm:flex">
        <Button variant="outline" size="icon" aria-label="Go Back">
          <IconPlaceholder
            lucide="arrow-left"
            tabler="arrow-left"
            ph="arrow-left"
            ri="arrow-left-line"
            hugeicons="arrow-left-02"
          />
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
            <IconPlaceholder
              lucide="ellipsis"
              tabler="dots"
              ph="dots-three"
              ri="more-line"
              hugeicons="more-horizontal"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-44">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="mail-check"
                  tabler="mail-check"
                  ph="envelope-open"
                  ri="mail-check-line"
                  hugeicons="mail-open-02"
                />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="archive"
                  tabler="archive"
                  ph="archive"
                  ri="archive-line"
                  hugeicons="archive-02"
                />
                Archive
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="clock"
                  tabler="clock"
                  ph="clock"
                  ri="time-line"
                  hugeicons="clock-01"
                />
                Snooze
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="calendar-plus"
                  tabler="calendar-plus"
                  ph="calendar-plus"
                  ri="calendar-schedule-line"
                  hugeicons="calendar-add-01"
                />
                Add to Calendar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="list-filter"
                  tabler="filter"
                  ph="funnel-simple"
                  ri="filter-3-line"
                  hugeicons="filter-horizontal"
                />
                Add to List
              </DropdownMenuItem>
              <DropdownMenuSub overlap>
                <DropdownMenuSubTrigger>
                  <IconPlaceholder
                    lucide="tag"
                    tabler="tag"
                    ph="tag"
                    ri="price-tag-3-line"
                    hugeicons="tag-01"
                  />
                  Label As...
                </DropdownMenuSubTrigger>
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
              </DropdownMenuSub>
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
                Trash
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
  );
}
