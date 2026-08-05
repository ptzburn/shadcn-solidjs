import { Show } from "solid-js";

import { IconMoon, IconSun } from "~/components/icons.tsx";
import { Toggle } from "~/registry/ui/toggle.tsx";

export default function ToggleDemo() {
  return (
    <Toggle>
      {(state) => (
        <Show when={state.pressed()} fallback={<IconMoon class="size-6" />}>
          <IconSun class="size-6" />
        </Show>
      )}
    </Toggle>
  );
}
