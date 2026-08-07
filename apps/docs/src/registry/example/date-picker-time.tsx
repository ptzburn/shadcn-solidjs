import { Index, Show } from "solid-js";
import { Portal } from "solid-js/web";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Field, FieldGroup, FieldLabel } from "~/registry/ui/field.tsx";
import { Input } from "~/registry/ui/input.tsx";
import {
  DatePicker,
  DatePickerContent,
  DatePickerContext,
  DatePickerControl,
  DatePickerMonthSelect,
  DatePickerNextTrigger,
  DatePickerPositioner,
  DatePickerPrevTrigger,
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
  DatePickerYearSelect,
} from "~/registry/ui/date-picker.tsx";

const selectClass =
  "h-7 rounded-md border border-input bg-transparent px-1.5 text-sm font-medium focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:bg-input/30";

export default function DatePickerTime() {
  return (
    <FieldGroup class="mx-auto max-w-xs flex-row">
      <Field>
        <FieldLabel for="date-picker-time-date">Date</FieldLabel>
        <DatePicker
          format={(date, details) =>
            new Intl.DateTimeFormat(details.locale, {
              dateStyle: "long",
            }).format(date.toDate(details.timeZone))}
        >
          <DatePickerControl>
            <DatePickerContext>
              {(api) => (
                <DatePickerTrigger
                  id="date-picker-time-date"
                  class="w-40 justify-between px-3 text-sm font-normal"
                >
                  <Show
                    when={api().valueAsString[0]}
                    fallback={<span>Select date</span>}
                  >
                    <span class="truncate">{api().valueAsString[0]}</span>
                  </Show>
                  <IconPlaceholder
                    lucide="chevron-down"
                    tabler="chevron-down"
                    ph="caret-down"
                    ri="arrow-down-s-line"
                    hugeicons="arrow-down-01"
                    class="size-4"
                    aria-hidden="true"
                  />
                </DatePickerTrigger>
              )}
            </DatePickerContext>
          </DatePickerControl>
          <Portal>
            <DatePickerPositioner>
              <DatePickerContent>
                <DatePickerView view="day">
                  <DatePickerContext>
                    {(api) => (
                      <>
                        <DatePickerViewControl>
                          <DatePickerPrevTrigger />
                          <div class="flex items-center gap-1.5">
                            <DatePickerMonthSelect
                              class={selectClass}
                              aria-label="Select month"
                            />
                            <DatePickerYearSelect
                              class={selectClass}
                              aria-label="Select year"
                            />
                          </div>
                          <DatePickerNextTrigger />
                        </DatePickerViewControl>
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
                      </>
                    )}
                  </DatePickerContext>
                </DatePickerView>
              </DatePickerContent>
            </DatePickerPositioner>
          </Portal>
        </DatePicker>
      </Field>
      <Field class="w-32">
        <FieldLabel for="date-picker-time-time">Time</FieldLabel>
        <Input
          type="time"
          id="date-picker-time-time"
          step="1"
          value="10:30:00"
          class="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
    </FieldGroup>
  );
}
