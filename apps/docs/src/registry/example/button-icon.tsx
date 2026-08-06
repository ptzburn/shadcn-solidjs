import { IconCircleFadingArrowUp } from "~/components/icons.tsx";

import { Button } from "~/registry/ui/button.tsx";

export default function ButtonIcon() {
  return (
    <Button variant="outline" size="icon">
      <IconCircleFadingArrowUp />
    </Button>
  );
}
