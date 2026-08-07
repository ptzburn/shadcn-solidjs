import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Toggle } from "~/registry/ui/toggle.tsx";

export default function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle bookmark" size="sm" variant="outline">
      <IconPlaceholder
        lucide="bookmark"
        tabler="bookmark"
        ph="bookmark"
        ri="bookmark-line"
        hugeicons="bookmark-01"
        class="group-data-[pressed]/toggle:*:fill-foreground"
      />
      Bookmark
    </Toggle>
  );
}
