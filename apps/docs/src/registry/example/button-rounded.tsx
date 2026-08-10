import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

import { Button } from "~/registry/ui/button.tsx";

export default function ButtonRounded() {
  return (
    <div class="flex gap-2">
      <Button class="rounded-full">Get Started</Button>
      <Button variant="outline" size="icon" class="rounded-full">
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
