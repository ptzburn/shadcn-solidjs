import { For } from "solid-js";

import type { Row } from "@tanstack/solid-table";

import { IconDots } from "~/components/icons.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";

import type { Task } from "./data.tsx";
import { labels } from "./data.tsx";
import type { TaskTableFeatures } from "./data-table.tsx";

type TableRowActionsProps = {
  row: Row<TaskTableFeatures, Task>;
};

export function TableRowActions(props: TableRowActionsProps) {
  return (
    <DropdownMenu placement="bottom-end">
      <DropdownMenuTrigger
        as={Button<"button">}
        variant="ghost"
        class="flex size-8 p-0 data-[state=open]:bg-muted"
      >
        <IconDots />
        <span class="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-[160px]">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub overlap>
          <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={props.row.original.label}>
              <For each={labels}>
                {(label) => (
                  <DropdownMenuRadioItem value={label.value}>
                    {label.label}
                  </DropdownMenuRadioItem>
                )}
              </For>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
