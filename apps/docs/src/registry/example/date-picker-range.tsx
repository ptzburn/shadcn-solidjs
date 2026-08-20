import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { Calendar } from "~/registry/ui/calendar.tsx";
import { Field, FieldLabel } from "~/registry/ui/field.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/registry/ui/popover.tsx";

import { createSignal, Show } from "solid-js";

type DateRange = { from: Date | null; to: Date | null };

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

const formatRange = (range: DateRange) => {
  if (!range.from) return null;
  if (!range.to) return formatDate(range.from);
  return `${formatDate(range.from)} - ${formatDate(range.to)}`;
};

export default function DatePickerRange() {
  const from = new Date(new Date().getFullYear(), 0, 20);
  const [range, setRange] = createSignal<DateRange>({
    from,
    to: addDays(from, 20),
  });

  return (
    <Field class="mx-auto w-60">
      <FieldLabel for="date-picker-range">Date Picker Range</FieldLabel>
      <Popover placement="bottom-start">
        <PopoverTrigger
          as={Button<"button">}
          variant="outline"
          id="date-picker-range"
          class="justify-start px-2.5 font-normal"
        >
          <IconPlaceholder
            lucide="calendar"
            tabler="calendar"
            ph="calendar-blank"
            ri="calendar-line"
            hugeicons="calendar-03"
          />
          <Show when={formatRange(range())} fallback={<span>Pick a date</span>}>
            {(label) => label()}
          </Show>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar
            mode="range"
            value={range()}
            onValueChange={setRange}
            initialMonth={range().from ?? undefined}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
