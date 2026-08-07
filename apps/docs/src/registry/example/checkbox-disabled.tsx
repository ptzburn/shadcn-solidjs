import { Checkbox } from "~/registry/ui/checkbox.tsx";
import { Field, FieldGroup, FieldLabel } from "~/registry/ui/field.tsx";

export default function CheckboxDisabled() {
  return (
    <FieldGroup class="mx-auto w-56">
      <Field orientation="horizontal" data-disabled>
        <Checkbox
          id="toggle-checkbox-disabled"
          name="toggle-checkbox-disabled"
          disabled
        />
        <FieldLabel for="toggle-checkbox-disabled-input">
          Enable notifications
        </FieldLabel>
      </Field>
    </FieldGroup>
  );
}
