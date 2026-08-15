import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "~/registry/ui/button-group.tsx";
import { Button } from "~/registry/ui/button.tsx";

export default function ButtonGroupSeparatorDemo() {
  return (
    <ButtonGroup>
      <Button variant="secondary" size="sm">
        Copy
      </Button>
      <ButtonGroupSeparator />
      <Button variant="secondary" size="sm">
        Paste
      </Button>
    </ButtonGroup>
  );
}
