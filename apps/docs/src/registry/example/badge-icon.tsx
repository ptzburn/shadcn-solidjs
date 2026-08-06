import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Badge } from "~/registry/ui/badge.tsx";

export default function BadgeWithIcon() {
  return (
    <div class="flex flex-wrap gap-2">
      <Badge variant="secondary">
        <IconPlaceholder
          lucide="badge-check"
          tabler="rosette-discount-check"
          ph="seal-check"
          ri="verified-badge-line"
          hugeicons="checkmark-badge-02"
          data-icon="inline-start"
        />
        Verified
      </Badge>
      <Badge variant="outline">
        Bookmark
        <IconPlaceholder
          lucide="bookmark"
          tabler="bookmark"
          ph="bookmark"
          ri="bookmark-line"
          hugeicons="bookmark-01"
          data-icon="inline-end"
        />
      </Badge>
    </div>
  );
}
