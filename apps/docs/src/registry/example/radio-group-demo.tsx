import { Label } from "~/registry/ui/label.tsx";
import { RadioGroup, RadioGroupItem } from "~/registry/ui/radio-group.tsx";

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable" class="w-fit">
      <div class="flex items-center gap-3">
        <RadioGroupItem value="default" id="r1" />
        <Label for="r1-input">Default</Label>
      </div>
      <div class="flex items-center gap-3">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label for="r2-input">Comfortable</Label>
      </div>
      <div class="flex items-center gap-3">
        <RadioGroupItem value="compact" id="r3" />
        <Label for="r3-input">Compact</Label>
      </div>
    </RadioGroup>
  );
}
