import { Calendar } from "~/registry/ui/calendar.tsx";
import { Card, CardContent } from "~/registry/ui/card.tsx";

import { createSignal } from "solid-js";

export default function CalendarWeekNumbers() {
  const [date, setDate] = createSignal<Date | null>(
    new Date(new Date().getFullYear(), 1, 3),
  );

  return (
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar
          mode="single"
          initialMonth={date() ?? undefined}
          value={date()}
          onValueChange={setDate}
          showWeekNumber
        />
      </CardContent>
    </Card>
  );
}
