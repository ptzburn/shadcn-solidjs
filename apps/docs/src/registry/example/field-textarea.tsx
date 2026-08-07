import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "~/registry/ui/field.tsx";
import { Textarea } from "~/registry/ui/textarea.tsx";

export default function FieldTextarea() {
  return (
    <FieldSet class="w-full max-w-xs">
      <FieldGroup>
        <Field>
          <FieldLabel for="feedback">Feedback</FieldLabel>
          <Textarea
            id="feedback"
            placeholder="Your feedback helps us improve..."
            rows={4}
          />
          <FieldDescription>
            Share your thoughts about our service.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
