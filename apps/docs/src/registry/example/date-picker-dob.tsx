import { Index, Show } from "solid-js";
import { Portal } from "solid-js/web";

import { Field, FieldLabel } from "~/registry/ui/field.tsx";
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

export default function DatePickerDob() {
  return (
    <Field class="mx-auto w-44">
      <FieldLabel for="date-picker-dob">Date of birth</FieldLabel>
      <DatePicker>
        <DatePickerControl class="w-full">
          <DatePickerContext>
            {(api) => (
              <DatePickerTrigger
                id="date-picker-dob"
                class="w-full justify-start px-3 text-sm font-normal"
              >
                <Show
                  when={api().valueAsString[0]}
                  fallback={<span>Select date</span>}
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
  );
}
