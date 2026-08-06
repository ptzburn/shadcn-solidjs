import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "~/registry/ui/button-group.tsx";

export default function ButtonGroupSplit() {
  return (
    <ButtonGroup>
      <Button variant="secondary">Button</Button>
      <ButtonGroupSeparator />
      <Button size="icon" variant="secondary">
        <IconPlaceholder
          lucide="plus"
          tabler="plus"
          ph="plus"
          ri="add-line"
          hugeicons="plus-sign"
        />
      </Button>
    </ButtonGroup>
  );
}
