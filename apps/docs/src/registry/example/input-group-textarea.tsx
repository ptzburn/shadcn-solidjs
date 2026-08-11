import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "~/registry/ui/input-group.tsx";

export default function InputGroupTextareaExample() {
  return (
    <div class="grid w-full max-w-md gap-4">
      <InputGroup>
        <InputGroupTextarea
          id="textarea-code-32"
          placeholder="console.log('Hello, world!');"
          class="min-h-[200px]"
        />
        <InputGroupAddon align="block-end" class="border-t">
          <InputGroupText>Line 1, Column 1</InputGroupText>
          <InputGroupButton size="sm" class="ml-auto" variant="default">
            Run{" "}
            <IconPlaceholder
              lucide="corner-down-left"
              tabler="corner-down-left"
              ph="arrow-elbow-down-left"
              ri="corner-down-left-line"
              hugeicons="arrow-move-down-left"
            />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupAddon align="block-start" class="border-b">
          <InputGroupText class="font-medium font-mono">
            <IconPlaceholder
              lucide="file-code"
              tabler="file-code"
              ph="file-code"
              ri="file-code-line"
              hugeicons="file-script"
            />
            script.js
          </InputGroupText>
          <InputGroupButton class="ml-auto" size="icon-xs">
            <IconPlaceholder
              lucide="refresh-ccw"
              tabler="refresh"
              ph="arrows-clockwise"
              ri="refresh-line"
              hugeicons="refresh"
            />
          </InputGroupButton>
          <InputGroupButton variant="ghost" size="icon-xs">
            <IconPlaceholder
              lucide="copy"
              tabler="copy"
              ph="copy"
              ri="file-copy-line"
              hugeicons="copy-01"
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
