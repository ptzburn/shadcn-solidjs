import { Checkbox } from "~/registry/ui/checkbox.tsx";
import { Field, FieldGroup, FieldLabel } from "~/registry/ui/field.tsx";

export default function CheckboxInvalid() {
  return (
    <FieldGroup class="mx-auto w-56">
      <Field orientation="horizontal" data-invalid>
        <Checkbox
          id="terms-checkbox-invalid"
          name="terms-checkbox-invalid"
          validationState="invalid"
        />
        <FieldLabel for="terms-checkbox-invalid-input">
          Accept terms and conditions
        </FieldLabel>
      </Field>
    </FieldGroup>
  );
}
