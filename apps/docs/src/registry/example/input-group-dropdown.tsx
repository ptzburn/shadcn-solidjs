import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/registry/ui/input-group.tsx";

export default function InputGroupDropdown() {
  return (
    <div class="grid w-full max-w-sm gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Enter file name" />
        <InputGroupAddon align="inline-end">
          <DropdownMenu placement="bottom-end">
            <DropdownMenuTrigger
              as={InputGroupButton}
              variant="ghost"
              aria-label="More"
              size="icon-xs"
            >
              <IconPlaceholder
                lucide="ellipsis"
                tabler="dots"
                ph="dots-three"
                ri="more-line"
                hugeicons="more-horizontal"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-auto">
              <DropdownMenuGroup>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Copy path</DropdownMenuItem>
                <DropdownMenuItem>Open location</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup class="[--radius:1rem]">
        <InputGroupInput placeholder="Enter search query" />
        <InputGroupAddon align="inline-end">
          <DropdownMenu placement="bottom-end">
            <DropdownMenuTrigger
              as={InputGroupButton}
              variant="ghost"
              class="pr-1.5! text-xs"
            >
              Search In...{" "}
              <IconPlaceholder
                lucide="chevron-down"
                tabler="chevron-down"
                ph="caret-down"
                ri="arrow-down-s-line"
                hugeicons="arrow-down-01"
                class="size-3"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent class="[--radius:0.95rem] w-auto">
              <DropdownMenuGroup>
                <DropdownMenuItem>Documentation</DropdownMenuItem>
                <DropdownMenuItem>Blog Posts</DropdownMenuItem>
                <DropdownMenuItem>Changelog</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
