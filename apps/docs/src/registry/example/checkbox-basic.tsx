import { Checkbox } from "~/registry/ui/checkbox.tsx";
import { Field, FieldGroup, FieldLabel } from "~/registry/ui/field.tsx";

export default function CheckboxBasic() {
  return (
    <FieldGroup class="mx-auto w-56">
      <Field orientation="horizontal">
        <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
        <FieldLabel for="terms-checkbox-basic-input">
          Accept terms and conditions
        </FieldLabel>
      </Field>
    </FieldGroup>
  );
}
