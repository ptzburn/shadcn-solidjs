import { Calendar, CalendarDayButton } from "~/registry/ui/calendar.tsx";
import { Card, CardContent } from "~/registry/ui/card.tsx";

import { createSignal, Show, splitProps } from "solid-js";

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

export default function CalendarCustomDays() {
  const from = new Date(new Date().getFullYear(), 11, 8);
  const [range, setRange] = createSignal({
    from,
    to: addDays(from, 10),
  } as { from: Date | null; to: Date | null });

  return (
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar
          mode="range"
          initialMonth={range().from ?? undefined}
          value={range()}
          onValueChange={setRange}
          numberOfMonths={1}
          captionLayout="dropdown"
          class="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
          formatters={{
            formatMonthDropdown: (date, locale) =>
              date.toLocaleDateString(locale, { month: "long" }),
          }}
          components={{
            DayButton: (props) => {
              const [local, others] = splitProps(props, ["children"]);
              const isWeekend = () =>
                props.day.getDay() === 0 || props.day.getDay() === 6;

              return (
                <CalendarDayButton {...others}>
                  {local.children}
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
