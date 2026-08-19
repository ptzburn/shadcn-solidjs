import { Calendar } from "~/registry/ui/calendar.tsx";
import { Card, CardContent } from "~/registry/ui/card.tsx";

import { createSignal } from "solid-js";

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export default function CalendarBookedDates() {
  const [date, setDate] = createSignal<Date | null>(
    new Date(new Date().getFullYear(), 1, 3),
  );
  const bookedDates = Array.from(
    { length: 15 },
    (_, i) => new Date(new Date().getFullYear(), 1, 12 + i),
  );
  const isBooked = (day: Date) =>
    bookedDates.some((booked) => isSameDay(booked, day));

  return (
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar
          mode="single"
          initialMonth={date() ?? undefined}
          value={date()}
          onValueChange={setDate}
          disabled={isBooked}
          modifiers={{
            booked: isBooked,
          }}
          modifiersClassNames={{
            booked: "[&>button]:line-through opacity-100",
          }}
        />
      </CardContent>
    </Card>
  );
}
