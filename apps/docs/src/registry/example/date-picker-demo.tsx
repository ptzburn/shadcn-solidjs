import { Index, Show } from "solid-js";
import { Portal } from "solid-js/web";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
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
  DatePickerViewTrigger,
} from "~/registry/ui/date-picker.tsx";

export default function DatePickerDemo() {
  return (
    <DatePicker
      format={(date, details) =>
        new Intl.DateTimeFormat(details.locale, {
          dateStyle: "long",
        }).format(date.toDate(details.timeZone))}
    >
      <DatePickerControl>
        <DatePickerContext>
          {(api) => (
            <DatePickerTrigger class="w-[212px] justify-between px-3 text-sm font-normal">
              <Show
                when={api().valueAsString[0]}
                fallback={
                  <span class="text-muted-foreground">Pick a date</span>
                }
              >
                <span>{api().valueAsString[0]}</span>
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
                      <DatePickerViewTrigger>
                        <DatePickerRangeText />
                      </DatePickerViewTrigger>
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
            <DatePickerView view="month">
              <DatePickerContext>
                {(api) => (
                  <>
                    <DatePickerViewControl>
                      <DatePickerPrevTrigger />
                      <DatePickerViewTrigger>
                        <DatePickerRangeText />
                      </DatePickerViewTrigger>
                      <DatePickerNextTrigger />
                    </DatePickerViewControl>
                    <DatePickerTable>
                      <DatePickerTableBody>
                        <Index
                          each={api().getMonthsGrid({
                            columns: 4,
                            format: "short",
                          })}
                        >
                          {(months) => (
                            <DatePickerTableRow>
                              <Index each={months()}>
                                {(month) => (
                                  <DatePickerTableCell value={month().value}>
                                    <DatePickerTableCellTrigger>
                                      {month().label}
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
            <DatePickerView view="year">
              <DatePickerContext>
                {(api) => (
                  <>
                    <DatePickerViewControl>
                      <DatePickerPrevTrigger />
                      <DatePickerViewTrigger>
                        <DatePickerRangeText />
                      </DatePickerViewTrigger>
                      <DatePickerNextTrigger />
                    </DatePickerViewControl>
                    <DatePickerTable>
                      <DatePickerTableBody>
                        <Index each={api().getYearsGrid({ columns: 4 })}>
                          {(years) => (
                            <DatePickerTableRow>
                              <Index each={years()}>
                                {(year) => (
                                  <DatePickerTableCell value={year().value}>
                                    <DatePickerTableCellTrigger>
                                      {year().label}
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
  );
}
