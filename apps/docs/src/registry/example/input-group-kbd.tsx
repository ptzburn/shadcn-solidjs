import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/registry/ui/input-group.tsx";
import { Kbd } from "~/registry/ui/kbd.tsx";

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
        <Kbd>⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  );
}
