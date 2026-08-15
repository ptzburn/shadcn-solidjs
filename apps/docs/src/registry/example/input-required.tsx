import { Field, FieldDescription, FieldLabel } from "~/registry/ui/field.tsx";
import { Input } from "~/registry/ui/input.tsx";

export default function InputRequired() {
  return (
    <Field>
      <FieldLabel for="input-required">
        Required Field <span class="text-destructive">*</span>
      </FieldLabel>
      <Input
        id="input-required"
        placeholder="This field is required"
        required
      />
      <FieldDescription>This field must be filled out.</FieldDescription>
    </Field>
  );
}
