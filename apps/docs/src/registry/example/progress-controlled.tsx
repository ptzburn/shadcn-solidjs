import { Progress } from "~/registry/ui/progress.tsx";

import { Slider } from "~/registry/ui/slider.tsx";
import { createSignal } from "solid-js";

export default function ProgressControlled() {
  const [value, setValue] = createSignal([50]);

  return (
    <div class="flex w-full max-w-sm flex-col gap-4">
      <Progress value={value()[0]} class="w-full" />
      <Slider
        value={value()}
        onChange={setValue}
        minValue={0}
        maxValue={100}
        step={1}
        aria-label="Progress value"
      />
    </div>
  );
}
