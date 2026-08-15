import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Field, FieldDescription, FieldLabel } from "~/registry/ui/field.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/registry/ui/input-group.tsx";

export default function InputGroupInlineStart() {
  return (
    <Field class="max-w-sm">
      <FieldLabel for="inline-start-input">Input</FieldLabel>
      <InputGroup>
        <InputGroupInput id="inline-start-input" placeholder="Search..." />
        <InputGroupAddon align="inline-start">
          <IconPlaceholder
            lucide="search"
            tabler="search"
            ph="magnifying-glass"
            ri="search-line"
            hugeicons="search-01"
            class="text-muted-foreground"
          />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Icon positioned at the start.</FieldDescription>
    </Field>
  );
}
