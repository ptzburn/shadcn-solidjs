import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { Calendar } from "~/registry/ui/calendar.tsx";
import { Field, FieldGroup, FieldLabel } from "~/registry/ui/field.tsx";
import { Input } from "~/registry/ui/input.tsx";
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

export default function DatePickerTime() {
  const [open, setOpen] = createSignal(false);
  const [date, setDate] = createSignal<Date | null>(null);

  return (
    <FieldGroup class="mx-auto max-w-xs flex-row">
      <Field>
        <FieldLabel for="date-picker-time-date">Date</FieldLabel>
        <Popover open={open()} onOpenChange={setOpen} placement="bottom-start">
          <PopoverTrigger
            as={Button<"button">}
            variant="outline"
            id="date-picker-time-date"
            class="w-32 justify-between font-normal"
          >
            <Show when={date()} fallback="Select date">
              {(value) => formatDate(value())}
            </Show>
            <IconPlaceholder
              lucide="chevron-down"
              tabler="chevron-down"
              ph="caret-down"
              ri="arrow-down-s-line"
              hugeicons="arrow-down-01"
            />
          </PopoverTrigger>
          <PopoverContent class="w-auto overflow-hidden p-0">
            <Calendar
              mode="single"
              value={date()}
              captionLayout="dropdown"
              initialMonth={date() ?? undefined}
              onValueChange={(value) => {
                setDate(value);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>
      <Field class="w-32">
        <FieldLabel for="date-picker-time-time">Time</FieldLabel>
        <Input
          type="time"
          id="date-picker-time-time"
          step="1"
          value="10:30:00"
          class="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
    </FieldGroup>
  );
}
