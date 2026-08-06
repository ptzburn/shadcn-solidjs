import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Badge } from "~/registry/ui/badge.tsx";

export default function BadgeAsLink() {
  return (
    <Badge as="a" href="#link">
      Open Link
      <IconPlaceholder
        lucide="arrow-up-right"
        tabler="arrow-up-right"
        ph="arrow-up-right"
        ri="arrow-right-up-line"
        hugeicons="arrow-up-right-01"
        data-icon="inline-end"
      />
    </Badge>
  );
}
