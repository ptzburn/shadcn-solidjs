import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { ButtonGroup } from "~/registry/ui/button-group.tsx";

export default function ButtonGroupOrientation() {
  return (
    <ButtonGroup
      orientation="vertical"
      aria-label="Media controls"
      class="h-fit"
    >
      <Button variant="outline" size="icon">
        <IconPlaceholder
          lucide="plus"
          tabler="plus"
          ph="plus"
          ri="add-line"
          hugeicons="plus-sign"
        />
      </Button>
      <Button variant="outline" size="icon">
        <IconPlaceholder
          lucide="minus"
          tabler="minus"
          ph="minus"
          ri="subtract-line"
          hugeicons="minus-sign"
        />
      </Button>
    </ButtonGroup>
  );
}
