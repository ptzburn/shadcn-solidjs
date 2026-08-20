import { Button } from "~/registry/ui/button.tsx";
import { Calendar } from "~/registry/ui/calendar.tsx";
import { Field, FieldLabel } from "~/registry/ui/field.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/registry/ui/popover.tsx";

import { createSignal, Show } from "solid-js";

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function DatePickerBasic() {
  const [date, setDate] = createSignal<Date | null>(null);

  return (
    <Field class="mx-auto w-44">
      <FieldLabel for="date-picker-basic">Date</FieldLabel>
      <Popover placement="bottom-start">
        <PopoverTrigger
          as={Button<"button">}
          variant="outline"
          id="date-picker-basic"
          class="justify-start font-normal"
        >
          <Show when={date()} fallback={<span>Pick a date</span>}>
            {(value) => formatDate(value())}
          </Show>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar
            mode="single"
            value={date()}
            onValueChange={setDate}
            initialMonth={date() ?? undefined}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
