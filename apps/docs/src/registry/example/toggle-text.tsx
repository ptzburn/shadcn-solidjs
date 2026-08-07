import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Toggle } from "~/registry/ui/toggle.tsx";

export default function ToggleText() {
  return (
    <Toggle aria-label="Toggle italic">
      <IconPlaceholder
        lucide="italic"
        tabler="italic"
        ph="text-italic"
        ri="italic"
        hugeicons="text-italic"
      />
      Italic
    </Toggle>
  );
}
