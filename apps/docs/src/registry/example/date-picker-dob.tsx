import { Button } from "~/registry/ui/button.tsx";
import { Calendar } from "~/registry/ui/calendar.tsx";
import { Field, FieldLabel } from "~/registry/ui/field.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/registry/ui/popover.tsx";

import { createSignal, Show } from "solid-js";

export default function DatePickerDob() {
  const [open, setOpen] = createSignal(false);
  const [date, setDate] = createSignal<Date | null>(null);

  return (
    <Field class="mx-auto w-44">
      <FieldLabel for="date-picker-dob">Date of birth</FieldLabel>
      <Popover open={open()} onOpenChange={setOpen} placement="bottom-start">
        <PopoverTrigger
          as={Button<"button">}
          variant="outline"
          id="date-picker-dob"
          class="justify-start font-normal"
        >
          <Show when={date()} fallback="Select date">
            {(value) => value().toLocaleDateString()}
          </Show>
        </PopoverTrigger>
        <PopoverContent class="w-auto overflow-hidden p-0">
          <Calendar
            mode="single"
            value={date()}
            initialMonth={date() ?? undefined}
            captionLayout="dropdown"
            onValueChange={(value) => {
              setDate(value);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
