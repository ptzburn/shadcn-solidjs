import { createMemo, Index, Show } from "solid-js";
import { Portal } from "solid-js/web";

import { parseDate } from "@ark-ui/solid";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Field, FieldLabel } from "~/registry/ui/field.tsx";
import {
  DatePicker,
  DatePickerContent,
  DatePickerContext,
  DatePickerControl,
  DatePickerNextTrigger,
  DatePickerPositioner,
  DatePickerPrevTrigger,
  DatePickerRangeText,
  DatePickerTable,
  DatePickerTableBody,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerTableHead,
  DatePickerTableHeader,
  DatePickerTableRow,
  DatePickerTrigger,
  DatePickerView,
  DatePickerViewControl,
} from "~/registry/ui/date-picker.tsx";

export default function DatePickerRange() {
  const year = new Date().getFullYear();

  return (
    <Field class="mx-auto w-60">
      <FieldLabel for="date-picker-range">Date Picker Range</FieldLabel>
      <DatePicker
        selectionMode="range"
        numOfMonths={2}
        defaultValue={[
          parseDate(new Date(year, 0, 20)),
          parseDate(new Date(year, 1, 9)),
        ]}
        format={(date, details) =>
          new Intl.DateTimeFormat(details.locale, {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(date.toDate(details.timeZone))}
      >
        <DatePickerControl class="w-full">
          <DatePickerContext>
            {(api) => (
              <DatePickerTrigger
                id="date-picker-range"
                class="w-full justify-start gap-2 px-2.5 text-sm font-normal"
              >
                <IconPlaceholder
                  lucide="calendar"
                  tabler="calendar"
                  ph="calendar-blank"
                  ri="calendar-line"
                  hugeicons="calendar-03"
                  class="size-4"
                  aria-hidden="true"
                />
                <Show
                  when={api().valueAsString.length > 0}
                  fallback={<span>Pick a date</span>}
                >
                  <span class="truncate">
                    {api().valueAsString.join(" - ")}
                  </span>
                </Show>
              </DatePickerTrigger>
            )}
          </DatePickerContext>
        </DatePickerControl>
        <Portal>
          <DatePickerPositioner>
            <DatePickerContent>
              <DatePickerView view="day">
                <DatePickerContext>
                  {(api) => {
                    const offset = createMemo(() =>
                      api().getOffset({ months: 1 })
                    );
                    return (
                      <>
                        <DatePickerViewControl>
                          <DatePickerPrevTrigger />
                          <DatePickerRangeText />
                          <DatePickerNextTrigger />
                        </DatePickerViewControl>
                        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <DatePickerTable>
                            <DatePickerTableHead>
                              <DatePickerTableRow>
                                <Index each={api().weekDays}>
                                  {(weekDay) => (
                                    <DatePickerTableHeader>
                                      {weekDay().short}
                                    </DatePickerTableHeader>
                                  )}
                                </Index>
                              </DatePickerTableRow>
                            </DatePickerTableHead>
                            <DatePickerTableBody>
                              <Index each={api().weeks}>
                                {(week) => (
                                  <DatePickerTableRow>
                                    <Index each={week()}>
                                      {(day) => (
                                        <DatePickerTableCell value={day()}>
                                          <DatePickerTableCellTrigger>
                                            {day().day}
                                          </DatePickerTableCellTrigger>
                                        </DatePickerTableCell>
                                      )}
                                    </Index>
                                  </DatePickerTableRow>
                                )}
                              </Index>
                            </DatePickerTableBody>
                          </DatePickerTable>
                          <DatePickerTable>
                            <DatePickerTableHead>
                              <DatePickerTableRow>
                                <Index each={api().weekDays}>
                                  {(weekDay) => (
                                    <DatePickerTableHeader>
                                      {weekDay().short}
                                    </DatePickerTableHeader>
                                  )}
                                </Index>
                              </DatePickerTableRow>
                            </DatePickerTableHead>
                            <DatePickerTableBody>
                              <Index each={offset().weeks}>
                                {(week) => (
                                  <DatePickerTableRow>
                                    <Index each={week()}>
                                      {(day) => (
                                        <DatePickerTableCell
                                          value={day()}
                                          visibleRange={offset().visibleRange}
                                        >
                                          <DatePickerTableCellTrigger>
                                            {day().day}
                                          </DatePickerTableCellTrigger>
                                        </DatePickerTableCell>
                                      )}
                                    </Index>
                                  </DatePickerTableRow>
                                )}
                              </Index>
                            </DatePickerTableBody>
                          </DatePickerTable>
                        </div>
                      </>
                    );
                  }}
                </DatePickerContext>
              </DatePickerView>
            </DatePickerContent>
          </DatePickerPositioner>
        </Portal>
      </DatePicker>
    </Field>
  );
}
