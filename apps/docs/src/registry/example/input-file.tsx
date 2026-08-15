import { Field, FieldDescription, FieldLabel } from "~/registry/ui/field.tsx";
import { Input } from "~/registry/ui/input.tsx";

export default function InputFile() {
  return (
    <Field>
      <FieldLabel for="picture">Picture</FieldLabel>
      <Input id="picture" type="file" />
      <FieldDescription>Select a picture to upload.</FieldDescription>
    </Field>
  );
}
