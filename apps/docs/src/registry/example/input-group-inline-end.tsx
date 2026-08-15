import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Field, FieldDescription, FieldLabel } from "~/registry/ui/field.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/registry/ui/input-group.tsx";

export default function InputGroupInlineEnd() {
  return (
    <Field class="max-w-sm">
      <FieldLabel for="inline-end-input">Input</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="inline-end-input"
          type="password"
          placeholder="Enter password"
        />
        <InputGroupAddon align="inline-end">
          <IconPlaceholder
            lucide="eye-off"
            tabler="eye-off"
            ph="eye-slash"
            ri="eye-off-line"
            hugeicons="view-off"
          />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Icon positioned at the end.</FieldDescription>
    </Field>
  );
}
