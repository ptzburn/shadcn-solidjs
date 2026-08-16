import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Toggle } from "~/registry/ui/toggle.tsx";

export default function ToggleOutline() {
  return (
    <div class="flex flex-wrap items-center gap-2">
      <Toggle variant="outline" aria-label="Toggle italic">
        <IconPlaceholder
          lucide="italic"
          tabler="italic"
          ph="text-italic"
          ri="italic"
          hugeicons="text-italic"
        />
        Italic
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle bold">
        <IconPlaceholder
          lucide="bold"
          tabler="bold"
          ph="text-b"
          ri="bold"
          hugeicons="text-bold"
        />
        Bold
      </Toggle>
    </div>
  );
}
