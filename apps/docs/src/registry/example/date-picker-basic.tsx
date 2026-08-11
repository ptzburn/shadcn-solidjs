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
import { Field, FieldLabel } from "~/registry/ui/field.tsx";

import { Index, Show } from "solid-js";
import { Portal } from "solid-js/web";

export default function DatePickerBasic() {
  return (
    <Field class="mx-auto w-44">
      <FieldLabel for="date-picker-basic">Date</FieldLabel>
      <DatePicker
        format={(date, details) =>
          new Intl.DateTimeFormat(details.locale, {
            dateStyle: "long",
          }).format(date.toDate(details.timeZone))}
      >
        <DatePickerControl class="w-full">
          <DatePickerContext>
            {(api) => (
              <DatePickerTrigger
                id="date-picker-basic"
                class="w-full justify-start px-3 font-normal text-sm"
              >
                <Show
                  when={api().valueAsString[0]}
                  fallback={<span>Pick a date</span>}
                >
                  <span>{api().valueAsString[0]}</span>
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
