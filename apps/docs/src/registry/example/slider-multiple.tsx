import { Slider } from "~/registry/ui/slider.tsx";

export default function SliderMultiple() {
  return (
    <Slider
      defaultValue={[10, 20, 70]}
      maxValue={100}
      step={10}
      class="mx-auto w-full max-w-xs"
    />
  );
}
