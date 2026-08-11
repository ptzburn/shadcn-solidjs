import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { ButtonGroup } from "~/registry/ui/button-group.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { Input } from "~/registry/ui/input.tsx";

export default function ButtonGroupInput() {
  return (
    <ButtonGroup>
      <Input placeholder="Search..." />
      <Button variant="outline" aria-label="Search">
        <IconPlaceholder
          lucide="search"
          tabler="search"
          ph="magnifying-glass"
          ri="search-line"
          hugeicons="search-01"
        />
      </Button>
    </ButtonGroup>
  );
}
