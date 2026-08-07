import { Index } from "solid-js";
import { Portal } from "solid-js/web";

import { parseDate } from "@ark-ui/solid";

import { Field, FieldLabel } from "~/registry/ui/field.tsx";
import {
  DatePicker,
  DatePickerContent,
  DatePickerContext,
  DatePickerControl,
  DatePickerInput,
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

export default function DatePickerWithInput() {
  return (
    <Field class="mx-auto w-56">
      <FieldLabel for="date-picker-input">Subscription Date</FieldLabel>
      <DatePicker
        defaultValue={[parseDate("2025-06-01")]}
        format={(date, details) =>
          new Intl.DateTimeFormat(details.locale, {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(date.toDate(details.timeZone))}
      >
        <DatePickerControl class="w-full">
          <DatePickerInput
            id="date-picker-input"
            placeholder="June 01, 2025"
          />
          <DatePickerTrigger aria-label="Select date" />
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
                        <DatePickerRangeText />
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
  );
}
