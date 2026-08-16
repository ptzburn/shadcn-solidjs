import { Slider } from "~/registry/ui/slider.tsx";

export default function SliderDemo() {
  return (
    <Slider
      defaultValue={[75]}
      maxValue={100}
      step={1}
      class="mx-auto w-full max-w-xs"
    />
  );
}
