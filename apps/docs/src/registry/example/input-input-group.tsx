import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Field, FieldLabel } from "~/registry/ui/field.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "~/registry/ui/input-group.tsx";

export default function InputInputGroup() {
  return (
    <Field>
      <FieldLabel for="input-group-url">Website URL</FieldLabel>
      <InputGroup>
        <InputGroupInput id="input-group-url" placeholder="example.com" />
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <IconPlaceholder
            lucide="info"
            tabler="info-circle"
            ph="info"
            ri="information-line"
            hugeicons="information-circle"
          />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
