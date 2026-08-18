import { Button } from "~/registry/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";

import { IconCheck, IconChevronDown } from "./icons.tsx";

const CURRENT_VERSION = "v2.0";
const PREVIOUS_DOCS_URL = "https://shadcn-solidjs.com";

export function VersionSwitcher() {
  return (
    <DropdownMenu placement="bottom-end">
      <DropdownMenuTrigger
        as={Button<"button">}
        size="sm"
        variant="ghost"
        class="shadow-none"
        aria-label="Documentation version"
      >
        {CURRENT_VERSION}
        <IconChevronDown class="text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent class="min-w-32">
        <DropdownMenuItem>
          {CURRENT_VERSION}
          <span class="ml-auto text-muted-foreground text-xs">Solid 2.0</span>
          <IconCheck />
        </DropdownMenuItem>
        <DropdownMenuItem as="a" href={PREVIOUS_DOCS_URL} rel="external">
          v1.x
          <span class="ml-auto text-muted-foreground text-xs">Solid 1.x</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
