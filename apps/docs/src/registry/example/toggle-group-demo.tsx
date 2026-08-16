import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { ToggleGroup, ToggleGroupItem } from "~/registry/ui/toggle-group.tsx";

export default function ToggleGroupDemo() {
  return (
    <ToggleGroup variant="outline" multiple>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <IconPlaceholder
          lucide="bold"
          tabler="bold"
          ph="text-b"
          ri="bold"
          hugeicons="text-bold"
        />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <IconPlaceholder
          lucide="italic"
          tabler="italic"
          ph="text-italic"
          ri="italic"
          hugeicons="text-italic"
        />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <IconPlaceholder
          lucide="underline"
          tabler="underline"
          ph="text-underline"
          ri="underline"
          hugeicons="text-underline"
        />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
