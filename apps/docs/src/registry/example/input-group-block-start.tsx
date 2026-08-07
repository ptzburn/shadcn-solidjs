import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/registry/ui/field.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "~/registry/ui/input-group.tsx";

export default function InputGroupBlockStart() {
  return (
    <FieldGroup class="max-w-sm">
      <Field>
        <FieldLabel for="block-start-input">Input</FieldLabel>
        <InputGroup class="h-auto">
          <InputGroupInput
            id="block-start-input"
            placeholder="Enter your name"
          />
          <InputGroupAddon align="block-start">
            <InputGroupText>Full Name</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>Header positioned above the input.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel for="block-start-textarea">Textarea</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="block-start-textarea"
            placeholder="console.log('Hello, world!');"
            class="font-mono text-sm"
          />
          <InputGroupAddon align="block-start">
            <IconPlaceholder
              lucide="file-code"
              tabler="file-code"
              ph="file-code"
              ri="file-code-line"
              hugeicons="file-script"
              class="text-muted-foreground"
            />
            <InputGroupText class="font-mono">script.js</InputGroupText>
            <InputGroupButton size="icon-xs" class="ml-auto">
              <IconPlaceholder
                lucide="copy"
                tabler="copy"
                ph="copy"
                ri="file-copy-line"
                hugeicons="copy-01"
              />
              <span class="sr-only">Copy</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>
          Header positioned above the textarea.
        </FieldDescription>
      </Field>
    </FieldGroup>
  );
}
