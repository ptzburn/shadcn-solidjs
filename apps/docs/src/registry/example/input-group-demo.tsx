import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/registry/ui/input-group.tsx";

export default function InputGroupDemo() {
  return (
    <InputGroup class="max-w-xs">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <IconPlaceholder
          lucide="search"
          tabler="search"
          ph="magnifying-glass"
          ri="search-line"
          hugeicons="search-01"
        />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
    </InputGroup>
  );
}
