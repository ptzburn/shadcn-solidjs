import { IconMinus, IconPlus } from "~/components/icons.tsx";

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
        <IconPlus />
      </Button>
      <Button variant="outline" size="icon">
        <IconMinus />
      </Button>
    </ButtonGroup>
  );
}
