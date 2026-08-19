import { Calendar } from "~/registry/ui/calendar.tsx";

import { createSignal } from "solid-js";

export default function CalendarDemo() {
  const [date, setDate] = createSignal<Date | null>(new Date());

  return (
    <Calendar
      mode="single"
      value={date()}
      onValueChange={setDate}
      class="rounded-lg border"
      captionLayout="dropdown"
    />
  );
}
