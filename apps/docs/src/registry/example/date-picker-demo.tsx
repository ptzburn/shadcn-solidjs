import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { Calendar } from "~/registry/ui/calendar.tsx";
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

export default function DatePickerDemo() {
  const [date, setDate] = createSignal<Date | null>(null);

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger
        as={Button<"button">}
        variant="outline"
        class="w-[212px] justify-between font-normal"
      >
        <Show when={date()} fallback={<span>Pick a date</span>}>
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
      <PopoverContent class="w-auto p-0">
        <Calendar
          mode="single"
          value={date()}
          onValueChange={setDate}
          initialMonth={date() ?? undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
