import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "~/registry/ui/field.tsx";
import { RadioGroup, RadioGroupItem } from "~/registry/ui/radio-group.tsx";

export default function RadioGroupDescription() {
  return (
    <RadioGroup defaultValue="comfortable" class="w-fit">
      <Field orientation="horizontal">
        <RadioGroupItem value="default" id="desc-r1" />
        <FieldContent>
          <FieldLabel for="desc-r1-input">Default</FieldLabel>
          <FieldDescription>
            Standard spacing for most use cases.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="comfortable" id="desc-r2" />
        <FieldContent>
          <FieldLabel for="desc-r2-input">Comfortable</FieldLabel>
          <FieldDescription>More space between elements.</FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="compact" id="desc-r3" />
        <FieldContent>
          <FieldLabel for="desc-r3-input">Compact</FieldLabel>
          <FieldDescription>
            Minimal spacing for dense layouts.
          </FieldDescription>
        </FieldContent>
      </Field>
    </RadioGroup>
  );
}
