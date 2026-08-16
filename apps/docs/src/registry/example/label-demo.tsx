import { Checkbox } from "~/registry/ui/checkbox.tsx";
import { Label } from "~/registry/ui/label.tsx";

export default function LabelDemo() {
  return (
    <div class="flex gap-2">
      <Checkbox id="terms" />
      <Label for="terms-input">Accept terms and conditions</Label>
    </div>
  );
}
