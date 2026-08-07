import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/registry/ui/input-group.tsx";

export default function InputGroupKbd() {
  return (
    <InputGroup class="max-w-sm">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <IconPlaceholder
          lucide="search"
          tabler="search"
          ph="magnifying-glass"
          ri="search-line"
          hugeicons="search-01"
          class="text-muted-foreground"
        />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <kbd
          data-slot="kbd"
          class="pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 bg-muted px-1 font-sans text-xs font-medium text-muted-foreground select-none"
        >
          ⌘K
        </kbd>
      </InputGroupAddon>
    </InputGroup>
  );
}
