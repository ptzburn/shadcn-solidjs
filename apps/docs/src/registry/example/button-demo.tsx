import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

import { Button } from "~/registry/ui/button.tsx";

export default function ButtonDemo() {
  return (
    <div class="flex flex-wrap items-center gap-2 md:flex-row">
      <Button variant="outline">Button</Button>
      <Button variant="outline" size="icon" aria-label="Submit">
        <IconPlaceholder
          lucide="arrow-up"
          tabler="arrow-up"
          ph="arrow-up"
          ri="arrow-up-line"
          hugeicons="arrow-up-01"
        />
      </Button>
    </div>
  );
}
