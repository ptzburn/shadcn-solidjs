import { Calendar } from "~/registry/ui/calendar.tsx";
import { Card, CardContent } from "~/registry/ui/card.tsx";

import { createSignal } from "solid-js";

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

export default function CalendarRange() {
  const start = new Date(new Date().getFullYear(), 0, 12);
  const [dateRange, setDateRange] = createSignal<{ start: Date; end: Date } | null>({
    start,
    end: addDays(start, 30),
  });

  return (
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar
          selectionMode="range"
          defaultFocusedValue={dateRange()?.start}
          value={dateRange()}
          onChange={setDateRange}
          numberOfMonths={2}
          minValue={new Date(1900, 0, 1)}
          maxValue={new Date()}
        />
      </CardContent>
    </Card>
  );
}
