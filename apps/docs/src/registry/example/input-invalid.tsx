import { Field, FieldDescription, FieldLabel } from "~/registry/ui/field.tsx";
import { Input } from "~/registry/ui/input.tsx";

export default function InputInvalid() {
  return (
    <Field data-invalid>
      <FieldLabel for="input-invalid">Invalid Input</FieldLabel>
      <Input id="input-invalid" placeholder="Error" aria-invalid="true" />
      <FieldDescription>
        This field contains validation errors.
      </FieldDescription>
    </Field>
  );
}
