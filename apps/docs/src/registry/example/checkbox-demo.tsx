import { Checkbox } from "~/registry/ui/checkbox.tsx";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "~/registry/ui/field.tsx";
import { Label } from "~/registry/ui/label.tsx";

export default function CheckboxDemo() {
  return (
    <FieldGroup class="max-w-sm">
      <Field orientation="horizontal">
        <Checkbox id="terms-checkbox" name="terms-checkbox" />
        <Label for="terms-checkbox-input">Accept terms and conditions</Label>
      </Field>
      <Field orientation="horizontal">
        <Checkbox
          id="terms-checkbox-2"
          name="terms-checkbox-2"
          defaultChecked
        />
        <FieldContent>
          <FieldLabel for="terms-checkbox-2-input">
            Accept terms and conditions
          </FieldLabel>
          <FieldDescription>
            By clicking this checkbox, you agree to the terms.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal" data-disabled>
        <Checkbox id="toggle-checkbox" name="toggle-checkbox" disabled />
        <FieldLabel for="toggle-checkbox-input">
          Enable notifications
        </FieldLabel>
      </Field>
      <FieldLabel>
        <Field orientation="horizontal">
          <Checkbox id="toggle-checkbox-2" name="toggle-checkbox-2" />
          <FieldContent>
            <FieldTitle>Enable notifications</FieldTitle>
            <FieldDescription>
              You can enable or disable notifications at any time.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
    </FieldGroup>
  );
}
