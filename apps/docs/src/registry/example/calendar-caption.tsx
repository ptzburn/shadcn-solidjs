import { Calendar } from "~/registry/ui/calendar.tsx";

export default function CalendarCaption() {
  return (
    <Calendar
      selectionMode="single"
      captionLayout="dropdown"
      class="rounded-lg border"
    />
  );
}
