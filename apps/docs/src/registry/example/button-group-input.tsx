import { IconSearch } from "~/components/icons.tsx";

import { Button } from "~/registry/ui/button.tsx";
import { ButtonGroup } from "~/registry/ui/button-group.tsx";
import { Input } from "~/registry/ui/input.tsx";

export default function ButtonGroupInput() {
  return (
    <ButtonGroup>
      <Input placeholder="Search..." />
      <Button variant="outline" aria-label="Search">
        <IconSearch />
      </Button>
    </ButtonGroup>
  );
}
