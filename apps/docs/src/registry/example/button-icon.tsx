import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

import { Button } from "~/registry/ui/button.tsx";

export default function ButtonIcon() {
  return (
    <Button variant="outline" size="icon">
      <IconPlaceholder
        lucide="circle-fading-arrow-up"
        tabler="circle-arrow-up"
        ph="arrow-circle-up"
        ri="arrow-up-circle-line"
        hugeicons="circle-arrow-up-01"
      />
    </Button>
  );
}
