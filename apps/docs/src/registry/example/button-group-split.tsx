import { IconPlus } from "~/components/icons.tsx";

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
        <IconPlus />
      </Button>
    </ButtonGroup>
  );
}
