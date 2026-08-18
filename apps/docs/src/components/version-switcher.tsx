import { Button } from "~/registry/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";

import { IconCheck, IconChevronDown } from "./icons.tsx";

const CURRENT_VERSION = "v1.x";
const NEXT_DOCS_URL = "https://v2.shadcn-solidjs.com";

export function VersionSwitcher() {
  return (
    <DropdownMenu placement="bottom-end">
      <DropdownMenuTrigger
        as={Button}
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
          <span class="ml-auto text-muted-foreground text-xs">Solid 1.x</span>
          <IconCheck />
        </DropdownMenuItem>
        <DropdownMenuItem as="a" href={NEXT_DOCS_URL} rel="external">
          v2.0
          <span class="ml-auto text-muted-foreground text-xs">Solid 2.0</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
