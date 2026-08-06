import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { ButtonGroup } from "~/registry/ui/button-group.tsx";

export default function ButtonGroupSize() {
  return (
    <div class="flex flex-col items-start gap-8">
      <ButtonGroup>
        <Button variant="outline" size="sm">
          Small
        </Button>
        <Button variant="outline" size="sm">
          Button
        </Button>
        <Button variant="outline" size="sm">
          Group
        </Button>
        <Button variant="outline" size="icon-sm">
          <IconPlaceholder
            lucide="plus"
            tabler="plus"
            ph="plus"
            ri="add-line"
            hugeicons="plus-sign"
          />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Default</Button>
        <Button variant="outline">Button</Button>
        <Button variant="outline">Group</Button>
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="plus"
            tabler="plus"
            ph="plus"
            ri="add-line"
            hugeicons="plus-sign"
          />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="lg">
          Large
        </Button>
        <Button variant="outline" size="lg">
          Button
        </Button>
        <Button variant="outline" size="lg">
          Group
        </Button>
        <Button variant="outline" size="icon-lg">
          <IconPlaceholder
            lucide="plus"
            tabler="plus"
            ph="plus"
            ri="add-line"
            hugeicons="plus-sign"
          />
        </Button>
      </ButtonGroup>
    </div>
  );
}
