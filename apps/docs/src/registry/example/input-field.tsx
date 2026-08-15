import { Field, FieldDescription, FieldLabel } from "~/registry/ui/field.tsx";
import { Input } from "~/registry/ui/input.tsx";

export default function InputField() {
  return (
    <Field>
      <FieldLabel for="input-field-username">Username</FieldLabel>
      <Input
        id="input-field-username"
        type="text"
        placeholder="Enter your username"
      />
      <FieldDescription>
        Choose a unique username for your account.
      </FieldDescription>
    </Field>
  );
}
