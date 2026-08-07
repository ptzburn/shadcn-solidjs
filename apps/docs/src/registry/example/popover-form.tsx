import { Button } from "~/registry/ui/button.tsx";
import { Field, FieldGroup, FieldLabel } from "~/registry/ui/field.tsx";
import { Input } from "~/registry/ui/input.tsx";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "~/registry/ui/popover.tsx";

export default function PopoverForm() {
  return (
    <Popover placement="bottom-start">
      <PopoverTrigger as={Button<"button">} variant="outline">
        Open Popover
      </PopoverTrigger>
      <PopoverContent class="w-64">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the dimensions for the layer.
          </PopoverDescription>
        </PopoverHeader>
        <FieldGroup class="gap-4">
          <Field orientation="horizontal">
            <FieldLabel for="popover-form-width" class="w-1/2">
              Width
            </FieldLabel>
            <Input id="popover-form-width" value="100%" />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel for="popover-form-height" class="w-1/2">
              Height
            </FieldLabel>
            <Input id="popover-form-height" value="25px" />
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  );
}
