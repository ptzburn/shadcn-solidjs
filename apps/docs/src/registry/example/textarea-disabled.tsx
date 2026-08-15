import { Field, FieldLabel } from "~/registry/ui/field.tsx";
import { Textarea } from "~/registry/ui/textarea.tsx";

export default function TextareaDisabled() {
  return (
    <Field data-disabled>
      <FieldLabel for="textarea-disabled">Message</FieldLabel>
      <Textarea
        id="textarea-disabled"
        placeholder="Type your message here."
        disabled
      />
    </Field>
  );
}
