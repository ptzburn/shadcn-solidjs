import { Calendar } from "~/registry/ui/calendar.tsx";
import { Card, CardContent } from "~/registry/ui/card.tsx";

import { createSignal } from "solid-js";

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

export default function CalendarRange() {
  const from = new Date(new Date().getFullYear(), 0, 12);
  const [dateRange, setDateRange] = createSignal({
    from,
    to: addDays(from, 30),
  } as { from: Date | null; to: Date | null });

  return (
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar
          mode="range"
          initialMonth={dateRange().from ?? undefined}
          value={dateRange()}
          onValueChange={setDateRange}
          numberOfMonths={2}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")}
        />
      </CardContent>
    </Card>
  );
}
