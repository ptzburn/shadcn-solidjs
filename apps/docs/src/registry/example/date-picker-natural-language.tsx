import { parseDate } from "@ark-ui/solid";
import {
  DatePicker,
  DatePickerContent,
  DatePickerContext,
  DatePickerControl,
  DatePickerInput,
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

import { Field, FieldLabel } from "~/registry/ui/field.tsx";
import { parseDate as chronoParseDate } from "chrono-node";

import { Index } from "solid-js";
import { Portal } from "solid-js/web";

const selectClass =
  "h-7 rounded-md border border-input bg-transparent px-1.5 text-sm font-medium focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:bg-input/30";

export default function DatePickerNaturalLanguage() {
  const initialDate = chronoParseDate("In 2 days");

  return (
    <Field class="mx-auto w-full max-w-xs">
      <FieldLabel for="date-picker-natural-language">Schedule Date</FieldLabel>
      <DatePicker
        class="flex w-full flex-col gap-2.5"
        defaultValue={initialDate ? [parseDate(initialDate)] : []}
        format={(date, details) =>
          new Intl.DateTimeFormat(details.locale, {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(date.toDate(details.timeZone))}
        parse={(value) => {
          const parsed = chronoParseDate(value);
          return parsed ? parseDate(parsed) : undefined;
        }}
      >
        <DatePickerControl class="w-full">
          <DatePickerInput
            id="date-picker-natural-language"
            placeholder="Tomorrow or next week"
          />
          <DatePickerTrigger aria-label="Select date" />
        </DatePickerControl>
        <DatePickerContext>
          {(api) => (
            <div class="px-1 text-muted-foreground text-sm">
              Your post will be published on{" "}
              <span class="font-medium">{api().valueAsString[0] ?? "…"}</span>.
            </div>
          )}
        </DatePickerContext>
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
