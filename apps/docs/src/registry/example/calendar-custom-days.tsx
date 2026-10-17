import { Calendar, CalendarDayButton } from "~/registry/ui/calendar.tsx";
import { Card, CardContent } from "~/registry/ui/card.tsx";

import { createSignal, omit, Show } from "solid-js";

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

export default function CalendarCustomDays() {
  const start = new Date(new Date().getFullYear(), 11, 8);
  const [range, setRange] = createSignal<{ start: Date; end: Date } | null>({
    start,
    end: addDays(start, 10),
  });

  return (
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar
          selectionMode="range"
          defaultFocusedValue={range()?.start}
          value={range()}
          onChange={setRange}
          captionLayout="dropdown"
          class="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
          formatters={{
            formatMonthDropdown: (date, locale) =>
              date.toLocaleDateString(locale, { month: "long" }),
          }}
          components={{
            DayButton: (props) => {
              const others = omit(props, "children");
              const isWeekend = () => props.day.getDay() === 0 || props.day.getDay() === 6;

              return (
                <CalendarDayButton {...others}>
                  <Show when={!props.modifiers.outside}>
                    <span>{isWeekend() ? "$120" : "$100"}</span>
                  </Show>
                </CalendarDayButton>
              );
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
