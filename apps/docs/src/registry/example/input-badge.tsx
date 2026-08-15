import { Badge } from "~/registry/ui/badge.tsx";
import { Field, FieldLabel } from "~/registry/ui/field.tsx";
import { Input } from "~/registry/ui/input.tsx";

export default function InputBadge() {
  return (
    <Field>
      <FieldLabel for="input-badge">
        Webhook URL{" "}
        <Badge variant="secondary" class="ml-auto">
          Beta
        </Badge>
      </FieldLabel>
      <Input
        id="input-badge"
        type="url"
        placeholder="https://api.example.com/webhook"
      />
    </Field>
  );
}
