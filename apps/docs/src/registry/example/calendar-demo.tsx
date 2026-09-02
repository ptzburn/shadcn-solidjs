import { Calendar } from "~/registry/ui/calendar.tsx";

import { createSignal } from "solid-js";

export default function CalendarDemo() {
  const [date, setDate] = createSignal<Date | null>(new Date());

  return (
    <Calendar
      selectionMode="single"
      value={date()}
      onChange={setDate}
      class="rounded-lg border"
      captionLayout="dropdown"
    />
  );
}
