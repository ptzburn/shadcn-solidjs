import { Toggle } from "~/registry/ui/toggle.tsx";

export default function ToggleDisabled() {
  return (
    <div class="flex flex-wrap items-center gap-2">
      <Toggle aria-label="Toggle disabled" disabled>
        Disabled
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle disabled outline" disabled>
        Disabled
      </Toggle>
    </div>
  );
}
