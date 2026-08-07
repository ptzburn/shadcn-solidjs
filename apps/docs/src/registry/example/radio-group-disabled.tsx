import { Field, FieldLabel } from "~/registry/ui/field.tsx";
import { RadioGroup, RadioGroupItem } from "~/registry/ui/radio-group.tsx";

export default function RadioGroupDisabled() {
  return (
    <RadioGroup defaultValue="option2" class="w-fit">
      <Field orientation="horizontal" data-disabled>
        <RadioGroupItem value="option1" id="disabled-1" disabled />
        <FieldLabel for="disabled-1-input" class="font-normal">
          Disabled
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="option2" id="disabled-2" />
        <FieldLabel for="disabled-2-input" class="font-normal">
          Option 2
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="option3" id="disabled-3" />
        <FieldLabel for="disabled-3-input" class="font-normal">
          Option 3
        </FieldLabel>
      </Field>
    </RadioGroup>
  );
}
