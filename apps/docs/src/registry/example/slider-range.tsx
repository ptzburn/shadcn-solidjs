import { Slider } from "~/registry/ui/slider.tsx";

export default function SliderRange() {
  return (
    <Slider
      defaultValue={[25, 50]}
      maxValue={100}
      step={5}
      class="mx-auto w-full max-w-xs"
    />
  );
}
