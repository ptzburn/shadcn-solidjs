import * as CalendarPrimitive from "@kobalte/core/calendar";
import type { ComponentProps, JSX } from "@solidjs/web";
import { Dynamic } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import type { Component } from "solid-js";

import { createEffect, createSignal, For, omit, Repeat, Show } from "solid-js";
import { type ButtonProps, buttonVariants } from "./button.tsx";

type CalendarCaptionLayout = "label" | "dropdown" | "dropdown-months" | "dropdown-years";

type CalendarModifiers = {
  today: boolean;
  outside: boolean;
  [modifier: string]: boolean;
};

type CalendarFormatters = {
  formatCaption: (month: Date, locale: string) => string;
  formatMonthDropdown: (month: Date, locale: string) => string;
  formatYearDropdown: (month: Date, locale: string) => string;
  formatWeekdayName: (weekday: string, locale: string) => string;
  formatWeekNumber: (weekNumber: number, locale: string) => string;
};

type CalendarDayButtonProps = Omit<ComponentProps<"div">, "children"> & {
  day: Date;
  month: Date;
  modifiers: CalendarModifiers;
  children?: JSX.Element;
};

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

type CalendarProps = DistributiveOmit<CalendarPrimitive.CalendarRootOptions, "visibleDuration"> & {
  class?: string;
  captionLayout?: CalendarCaptionLayout;
  buttonVariant?: ButtonProps["variant"];
  showOutsideDays?: boolean;
  showWeekNumber?: boolean;
  numberOfMonths?: number;
  startMonth?: Date;
  endMonth?: Date;
  formatters?: Partial<CalendarFormatters>;
  modifiers?: Record<string, (day: Date) => boolean>;
  modifiersClassNames?: Record<string, string>;
  components?: {
    DayButton?: Component<CalendarDayButtonProps>;
  };
};

const defaultFormatters: CalendarFormatters = {
  formatCaption: (month, locale) =>
    month.toLocaleDateString(locale, { month: "long", year: "numeric" }),
  formatMonthDropdown: (month, locale) => month.toLocaleDateString(locale, { month: "short" }),
  formatYearDropdown: (month, locale) => month.toLocaleDateString(locale, { year: "numeric" }),
  formatWeekdayName: (weekday) => weekday.slice(0, 2),
  formatWeekNumber: (weekNumber, locale) => weekNumber.toLocaleString(locale),
};

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

const addMonths = (date: Date, months: number) =>
  new Date(date.getFullYear(), date.getMonth() + months, 1);

const monthsBetween = (from: Date, to: Date) =>
  (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());

const isSameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getWeekNumber = (date: Date) => {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const weekday = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - weekday);
  const yearStart = Date.UTC(target.getUTCFullYear(), 0, 1);
  return Math.ceil(((target.getTime() - yearStart) / 86400000 + 1) / 7);
};

const firstSelected = (props: CalendarProps): Date | undefined => {
  const value = props.value ?? props.defaultValue;
  if (!value) return undefined;
  if (Array.isArray(value)) return value[0];
  if (value instanceof Date) return value;
  return value.start ?? undefined;
};

const Calendar = (props: CalendarProps) => {
  const others = omit(
    props,
    "class",
    "captionLayout",
    "buttonVariant",
    "showOutsideDays",
    "showWeekNumber",
    "numberOfMonths",
    "startMonth",
    "endMonth",
    "formatters",
    "modifiers",
    "modifiersClassNames",
    "components",
    "focusedValue",
    "defaultFocusedValue",
    "onFocusChange",
    "minValue",
    "maxValue",
    "locale",
  ) as CalendarPrimitive.CalendarRootOptions;

  const now = new Date();
  const locale = () => props.locale ?? "en-US";
  const numberOfMonths = () => Math.max(1, props.numberOfMonths ?? 1);
  const captionLayout = () => props.captionLayout ?? "label";
  const showOutsideDays = () => props.showOutsideDays ?? true;
  const formatters = (): CalendarFormatters => ({
    ...defaultFormatters,
    ...props.formatters,
  });
  const hasMonthDropdown = () =>
    captionLayout() === "dropdown" || captionLayout() === "dropdown-months";
  const hasYearDropdown = () =>
    captionLayout() === "dropdown" || captionLayout() === "dropdown-years";
  const hasDropdown = () => hasMonthDropdown() || hasYearDropdown();

  const minValue = () => props.minValue ?? (props.startMonth && startOfMonth(props.startMonth));
  const maxValue = () => props.maxValue ?? (props.endMonth && endOfMonth(props.endMonth));
  const firstYear = () =>
    (props.startMonth ?? props.minValue)?.getFullYear() ??
    (hasYearDropdown() ? now.getFullYear() - 100 : undefined);
  const lastYear = () =>
    (props.endMonth ?? props.maxValue)?.getFullYear() ??
    (hasYearDropdown() ? now.getFullYear() : undefined);
  const isMonthInBounds = (month: Date) => {
    const min = minValue();
    const max = maxValue();
    return (!min || endOfMonth(month) >= min) && (!max || startOfMonth(month) <= max);
  };

  const [focused, setFocused] = createSignal<Date>(
    props.focusedValue ?? props.defaultFocusedValue ?? firstSelected(props) ?? now,
  );
  const alignStart = (date: Date) => startOfMonth(date);
  const alignEnd = (date: Date) => addMonths(date, 1 - numberOfMonths());
  const alignCenter = (date: Date) => {
    const months = numberOfMonths();
    let half = Math.floor(months / 2);
    if (half > 0 && months % 2 === 0) half--;
    return addMonths(date, -half);
  };
  const [visibleStart, setVisibleStart] = createSignal<Date>(alignCenter(focused()));
  const visibleEnd = () => endOfMonth(addMonths(visibleStart(), numberOfMonths() - 1));

  const trackFocus = (date: Date, previous: Date) => {
    const months = numberOfMonths();
    if (months === 1) {
      setVisibleStart(startOfMonth(date));
      return;
    }
    if (date >= visibleStart() && date <= visibleEnd()) return;
    const delta = monthsBetween(previous, date);
    if (delta % months === 0 && previous.getDate() === date.getDate()) {
      setVisibleStart(addMonths(visibleStart(), delta));
    } else if (date < visibleStart()) {
      setVisibleStart(alignEnd(date));
    } else {
      setVisibleStart(alignStart(date));
    }
  };
  const moveFocus = (date: Date) => {
    trackFocus(date, focused());
    setFocused(date);
    props.onFocusChange?.(date);
  };
  createEffect(
    () => props.focusedValue,
    (date) => {
      if (date && !isSameDay(date, focused())) {
        trackFocus(date, focused());
        setFocused(date);
      }
    },
  );

  const gridMonth = (index: number) => addMonths(visibleStart(), index);

  const getModifiers = (day: Date, month: Date): CalendarModifiers => {
    const modifiers: CalendarModifiers = {
      today: isSameDay(day, now),
      outside: day.getMonth() !== month.getMonth() || day.getFullYear() !== month.getFullYear(),
    };
    for (const [name, matcher] of Object.entries(props.modifiers ?? {})) {
      modifiers[name] = matcher(day);
    }
    return modifiers;
  };

  const navButtonClass = () =>
    cn(
      buttonVariants({ variant: props.buttonVariant ?? "ghost" }),
      "size-(--cell-size) select-none p-0 aria-disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50",
    );

  const monthOptions = (month: Date) =>
    Array.from({ length: 12 }, (_, index) => {
      const value = new Date(month.getFullYear(), index, 1);
      return {
        value: index,
        label: formatters().formatMonthDropdown(value, locale()),
        disabled: !isMonthInBounds(value),
      };
    });

  const yearOptions = (month: Date) => {
    const start = firstYear() ?? month.getFullYear();
    const end = lastYear() ?? month.getFullYear();
    return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => {
      const value = new Date(start + index, month.getMonth(), 1);
      return {
        value: start + index,
        label: formatters().formatYearDropdown(value, locale()),
      };
    });
  };

  const jumpTo = (year: number, month: number) => {
    const day = Math.min(focused().getDate(), endOfMonth(new Date(year, month, 1)).getDate());
    moveFocus(new Date(year, month, day));
  };

  const dayClass = (modifiers: CalendarModifiers) =>
    cn(
      "group/day relative aspect-square h-full w-full select-none rounded-(--cell-radius) p-0 text-center has-data-[selection-start]:relative has-data-[selection-start]:isolate has-data-[selection-start]:z-0 has-data-[selection-end]:rounded-r-(--cell-radius) has-data-[selection-start]:rounded-l-(--cell-radius) has-data-[selection-end]:after:absolute has-data-[selection-start]:after:absolute has-data-[selection-end]:after:inset-y-0 has-data-[selection-start]:after:inset-y-0 has-data-[selection-start]:after:right-0 has-data-[selection-end]:after:left-0 has-data-[selection-end]:after:w-4 has-data-[selection-start]:after:w-4 has-data-[selection-end]:after:bg-muted has-data-[selection-start]:after:bg-muted group-data-[selection-mode=range]/calendar:has-data-[selected]:bg-muted [&:last-child:has([data-selected])]:rounded-r-(--cell-radius) [&:has([data-selection-start]):has([data-selection-end])]:after:hidden group-data-[selection-mode=range]/calendar:[&:has([data-selected]):not(:has([data-selection-start])):not(:has([data-selection-end]))]:rounded-none",
      props.showWeekNumber
        ? "[&:nth-child(2):has([data-selected])]:rounded-l-(--cell-radius)"
        : "[&:first-child:has([data-selected])]:rounded-l-(--cell-radius)",
      "has-data-[disabled]:text-muted-foreground has-data-[outside-month]:text-muted-foreground has-data-[disabled]:opacity-50",
      !showOutsideDays() && "has-data-[outside-month]:invisible",
      modifiers.today &&
        "rounded-(--cell-radius) bg-muted text-foreground group-data-[selection-mode=range]/calendar:has-data-[selected]:rounded-none",
      ...Object.entries(props.modifiersClassNames ?? {})
        .filter(([name]) => modifiers[name])
        .map(([, className]) => className),
    );

  return (
    <CalendarPrimitive.Root
      data-slot="calendar"
      data-selection-mode={props.selectionMode}
      locale={locale()}
      visibleDuration={{ months: numberOfMonths() }}
      minValue={minValue()}
      maxValue={maxValue()}
      focusedValue={props.focusedValue ?? focused()}
      onFocusChange={moveFocus}
      class={cn(
        "cn-calendar group/calendar w-fit bg-background in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        props.class,
      )}
      {...others}
    >
      <div class="relative flex flex-col gap-4 md:flex-row">
        <CalendarPrimitive.Header class="absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1">
          <CalendarPrimitive.PrevTrigger class={navButtonClass()}>
            <IconPlaceholder
              lucide="chevron-left"
              tabler="chevron-left"
              ph="caret-left"
              ri="arrow-left-s-line"
              hugeicons="arrow-left-01"
              class="cn-rtl-flip size-4"
            />
          </CalendarPrimitive.PrevTrigger>
          <CalendarPrimitive.Heading class="sr-only" />
          <CalendarPrimitive.NextTrigger class={navButtonClass()}>
            <IconPlaceholder
              lucide="chevron-right"
              tabler="chevron-right"
              ph="caret-right"
              ri="arrow-right-s-line"
              hugeicons="arrow-right-01"
              class="cn-rtl-flip size-4"
            />
          </CalendarPrimitive.NextTrigger>
        </CalendarPrimitive.Header>
        <CalendarPrimitive.Body class="flex flex-col gap-4 md:flex-row">
          <Repeat count={numberOfMonths()}>
            {(index) => (
              <div class="flex w-full flex-col gap-4">
                <div class="flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)">
                  <Show
                    when={hasDropdown()}
                    fallback={
                      <span
                        aria-hidden="true"
                        class="cn-calendar-caption select-none font-medium text-sm"
                      >
                        {formatters().formatCaption(gridMonth(index), locale())}
                      </span>
                    }
                  >
                    <div class="flex h-(--cell-size) w-full items-center justify-center gap-1.5 font-medium text-sm">
                      <Show
                        when={hasMonthDropdown()}
                        fallback={
                          <span>
                            {formatters().formatMonthDropdown(gridMonth(index), locale())}
                          </span>
                        }
                      >
                        <span class="cn-calendar-dropdown-root relative rounded-(--cell-radius)">
                          <select
                            aria-label="Choose the Month"
                            class="absolute inset-0 bg-popover opacity-0"
                            onChange={(event) =>
                              jumpTo(
                                gridMonth(index).getFullYear(),
                                Number(event.currentTarget.value) - index,
                              )
                            }
                          >
                            <For each={monthOptions(gridMonth(index))}>
                              {(option) => (
                                <option
                                  value={option.value}
                                  disabled={option.disabled}
                                  selected={option.value === gridMonth(index).getMonth()}
                                >
                                  {option.label}
                                </option>
                              )}
                            </For>
                          </select>
                          <span
                            aria-hidden="true"
                            class="cn-calendar-caption-label flex select-none items-center gap-1 rounded-(--cell-radius) font-medium text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground"
                          >
                            {formatters().formatMonthDropdown(gridMonth(index), locale())}
                            <IconPlaceholder
                              lucide="chevron-down"
                              tabler="chevron-down"
                              ph="caret-down"
                              ri="arrow-down-s-line"
                              hugeicons="arrow-down-01"
                              class="size-4"
                            />
                          </span>
                        </span>
                      </Show>
                      <Show
                        when={hasYearDropdown()}
                        fallback={
                          <span>{formatters().formatYearDropdown(gridMonth(index), locale())}</span>
                        }
                      >
                        <span class="cn-calendar-dropdown-root relative rounded-(--cell-radius)">
                          <select
                            aria-label="Choose the Year"
                            class="absolute inset-0 bg-popover opacity-0"
                            onChange={(event) =>
                              jumpTo(
                                Number(event.currentTarget.value),
                                gridMonth(index).getMonth() - index,
                              )
                            }
                          >
                            <For each={yearOptions(gridMonth(index))}>
                              {(option) => (
                                <option
                                  value={option.value}
                                  selected={option.value === gridMonth(index).getFullYear()}
                                >
                                  {option.label}
                                </option>
                              )}
                            </For>
                          </select>
                          <span
                            aria-hidden="true"
                            class="cn-calendar-caption-label flex select-none items-center gap-1 rounded-(--cell-radius) font-medium text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground"
                          >
                            {formatters().formatYearDropdown(gridMonth(index), locale())}
                            <IconPlaceholder
                              lucide="chevron-down"
                              tabler="chevron-down"
                              ph="caret-down"
                              ri="arrow-down-s-line"
                              hugeicons="arrow-down-01"
                              class="size-4"
                            />
                          </span>
                        </span>
                      </Show>
                    </div>
                  </Show>
                </div>
                <CalendarPrimitive.Grid
                  offset={{ months: index }}
                  weekDayFormat="short"
                  class="w-full border-collapse"
                >
                  <CalendarPrimitive.GridHeader>
                    <CalendarPrimitive.GridHeaderRow class="flex">
                      {(weekday) => (
                        <>
                          <Show when={props.showWeekNumber}>
                            <th aria-label="Week Number" class="w-(--cell-size) select-none" />
                          </Show>
                          <CalendarPrimitive.GridHeaderCell class="flex-1 select-none rounded-(--cell-radius) font-normal text-muted-foreground text-[0.8rem]">
                            {formatters().formatWeekdayName(weekday(), locale())}
                          </CalendarPrimitive.GridHeaderCell>
                        </>
                      )}
                    </CalendarPrimitive.GridHeaderRow>
                  </CalendarPrimitive.GridHeader>
                  <CalendarPrimitive.GridBody>
                    {(weekIndex) => {
                      let column = 0;
                      return (
                        <CalendarPrimitive.GridBodyRow
                          weekIndex={weekIndex()}
                          class="mt-2 flex w-full"
                        >
                          {(date) => {
                            const cell = column++;
                            return (
                              <>
                                <Show when={props.showWeekNumber && cell === 0}>
                                  <td class="select-none text-muted-foreground text-[0.8rem]">
                                    <div class="flex size-(--cell-size) items-center justify-center text-center">
                                      <Show when={date()}>
                                        {(day) =>
                                          formatters().formatWeekNumber(
                                            getWeekNumber(day()),
                                            locale(),
                                          )
                                        }
                                      </Show>
                                    </div>
                                  </td>
                                </Show>
                                <Show when={date()} fallback={<td class="size-(--cell-size)" />}>
                                  {(day) => {
                                    const modifiers = () => getModifiers(day(), gridMonth(index));
                                    return (
                                      <CalendarPrimitive.GridBodyCell
                                        date={day()}
                                        class={dayClass(modifiers())}
                                        data-day={day().toLocaleDateString(locale())}
                                      >
                                        <Dynamic
                                          component={
                                            props.components?.DayButton ?? CalendarDayButton
                                          }
                                          day={day()}
                                          month={gridMonth(index)}
                                          modifiers={modifiers()}
                                        />
                                      </CalendarPrimitive.GridBodyCell>
                                    );
                                  }}
                                </Show>
                              </>
                            );
                          }}
                        </CalendarPrimitive.GridBodyRow>
                      );
                    }}
                  </CalendarPrimitive.GridBody>
                </CalendarPrimitive.Grid>
              </div>
            )}
          </Repeat>
        </CalendarPrimitive.Body>
      </div>
    </CalendarPrimitive.Root>
  );
};

type DayButtonContentProps = ComponentProps<"div"> & { extra?: JSX.Element };

const DayButtonContent = (props: DayButtonContentProps) => {
  const others = omit(props, "extra", "children");
  return (
    <div {...others}>
      {props.children}
      {props.extra}
    </div>
  );
};

const CalendarDayButton: Component<CalendarDayButtonProps> = (props) => {
  const others = omit(props, "class", "day", "month", "modifiers", "children");

  return (
    <CalendarPrimitive.GridBodyCellTrigger
      as={DayButtonContent}
      extra={props.children}
      class={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "cn-calendar-day-button relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 font-normal leading-none focus-visible:relative focus-visible:z-10 dark:hover:text-foreground data-disabled:pointer-events-none data-selection-end:rounded-(--cell-radius) data-selection-end:rounded-r-(--cell-radius) data-selection-start:rounded-(--cell-radius) data-selection-start:rounded-l-(--cell-radius) data-selected:bg-primary [&>span]:text-xs data-selected:text-primary-foreground [&>span]:opacity-70 data-outside-month:opacity-100 group-data-[selection-mode=range]/calendar:[&[data-selected]:not([data-selection-start]):not([data-selection-end])]:rounded-none group-data-[selection-mode=range]/calendar:[&[data-selected]:not([data-selection-start]):not([data-selection-end])]:bg-muted group-data-[selection-mode=range]/calendar:[&[data-selected]:not([data-selection-start]):not([data-selection-end])]:text-foreground",
        props.class,
      )}
      {...others}
    />
  );
};

export { Calendar, CalendarDayButton };
export type {
  CalendarCaptionLayout,
  CalendarDayButtonProps,
  CalendarFormatters,
  CalendarModifiers,
  CalendarProps,
};
