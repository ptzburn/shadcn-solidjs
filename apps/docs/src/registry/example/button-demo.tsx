import { IconArrowUp } from "~/components/icons.tsx";

import { Button } from "~/registry/ui/button.tsx";

export default function ButtonDemo() {
  return (
    <div class="flex flex-wrap items-center gap-2 md:flex-row">
      <Button variant="outline">Button</Button>
      <Button variant="outline" size="icon" aria-label="Submit">
        <IconArrowUp />
      </Button>
    </div>
  );
}
