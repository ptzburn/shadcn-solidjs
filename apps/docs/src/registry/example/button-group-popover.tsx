import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { ButtonGroup } from "~/registry/ui/button-group.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { Field, FieldDescription, FieldLabel } from "~/registry/ui/field.tsx";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "~/registry/ui/popover.tsx";
import { Textarea } from "~/registry/ui/textarea.tsx";

export default function ButtonGroupPopover() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <IconPlaceholder
          lucide="bot"
          tabler="robot"
          ph="robot"
          ri="robot-line"
          hugeicons="robotic"
        />{" "}
        Copilot
      </Button>
      <Popover>
        <PopoverTrigger
          as={Button<"button">}
          variant="outline"
          size="icon"
          aria-label="Open Popover"
        >
          <IconPlaceholder
            lucide="chevron-down"
            tabler="chevron-down"
            ph="caret-down"
            ri="arrow-down-s-line"
            hugeicons="arrow-down-01"
          />
        </PopoverTrigger>
        <PopoverContent class="rounded-xl text-sm">
          <PopoverHeader>
            <PopoverTitle>Start a new task with Copilot</PopoverTitle>
            <PopoverDescription>
              Describe your task in natural language.
            </PopoverDescription>
          </PopoverHeader>
          <Field>
            <FieldLabel for="task" class="sr-only">
              Task Description
            </FieldLabel>
            <Textarea
              id="task"
              placeholder="I need to..."
              class="resize-none"
            />
            <FieldDescription>
              Copilot will open a pull request for review.
            </FieldDescription>
          </Field>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  );
}
