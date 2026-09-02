import { Button } from "~/registry/ui/button.tsx";
import { Calendar } from "~/registry/ui/calendar.tsx";
import { Card, CardContent, CardFooter } from "~/registry/ui/card.tsx";

import { createSignal, For } from "solid-js";

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

const presets = [
  { label: "Today", value: 0 },
  { label: "Tomorrow", value: 1 },
  { label: "In 3 days", value: 3 },
  { label: "In a week", value: 7 },
  { label: "In 2 weeks", value: 14 },
];

export default function CalendarPresets() {
  const [date, setDate] = createSignal<Date | null>(
    new Date(new Date().getFullYear(), 1, 12),
  );
  const [focused, setFocused] = createSignal(new Date());

  return (
    <Card class="mx-auto w-fit max-w-[300px]" size="sm">
      <CardContent>
        <Calendar
          selectionMode="single"
          value={date()}
          onChange={setDate}
          focusedValue={focused()}
          onFocusChange={setFocused}
          class="[--cell-size:--spacing(9.5)] p-0"
        />
      </CardContent>
      <CardFooter class="flex flex-wrap gap-2 border-t">
        <For each={presets}>
          {(preset) => (
            <Button
              variant="outline"
              size="sm"
              class="flex-1"
              onClick={() => {
                const newDate = addDays(new Date(), preset.value);
                setDate(newDate);
                setFocused(newDate);
              }}
            >
              {preset.label}
            </Button>
          )}
        </For>
      </CardFooter>
    </Card>
  );
}
