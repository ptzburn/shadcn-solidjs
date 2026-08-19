import type { RootChildrenProps, RootProps } from "@corvu/calendar";
import CalendarPrimitive from "@corvu/calendar";

import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

import type { Component, ComponentProps, JSX } from "solid-js";
import { createSignal, Index, onMount, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { type ButtonProps, buttonVariants } from "./button.tsx";

type CalendarCaptionLayout =
  | "label"
  | "dropdown"
  | "dropdown-months"
  | "dropdown-years";

type CalendarModifiers = {
  selected: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
  rangeMiddle: boolean;
  today: boolean;
  outside: boolean;
  disabled: boolean;
  hidden: boolean;
  [modifier: string]: boolean;
};

type CalendarFormatters = {
  formatCaption: (month: Date, locale: string) => string;
  formatMonthDropdown: (month: Date, locale: string) => string;
  formatYearDropdown: (month: Date, locale: string) => string;
  formatWeekdayName: (weekday: Date, locale: string) => string;
  formatWeekNumber: (weekNumber: number, locale: string) => string;
  formatDay: (day: Date, locale: string) => string;
};

type CalendarDayButtonProps = Omit<ComponentProps<"button">, "children"> & {
  day: Date;
  month: Date;
  modifiers: CalendarModifiers;
  children?: JSX.Element;
};

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K>
  : never;

type CalendarProps = DistributiveOmit<RootProps, "children"> & {
  class?: string;
  captionLayout?: CalendarCaptionLayout;
  buttonVariant?: ButtonProps["variant"];
  showOutsideDays?: boolean;
  showWeekNumber?: boolean;
  startMonth?: Date;
  endMonth?: Date;
  locale?: string;
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
  formatMonthDropdown: (month, locale) =>
    month.toLocaleDateString(locale, { month: "short" }),
  formatYearDropdown: (month, locale) =>
    month.toLocaleDateString(locale, { year: "numeric" }),
  formatWeekdayName: (weekday, locale) =>
    weekday.toLocaleDateString(locale, { weekday: "short" }).slice(0, 2),
  formatWeekNumber: (weekNumber, locale) => weekNumber.toLocaleString(locale),
  formatDay: (day, locale) =>
    day.toLocaleDateString(locale, { day: "numeric" }),
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const isSameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isSameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${
    String(date.getDate()).padStart(2, "0")
  }`;

const getWeekNumber = (date: Date) => {
  const target = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const weekday = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - weekday);
  const yearStart = Date.UTC(target.getUTCFullYear(), 0, 1);
  return Math.ceil(((target.getTime() - yearStart) / 86400000 + 1) / 7);
};

const Calendar = (props: CalendarProps) => {
  const now = new Date();
  const [today, setToday] = createSignal<Date | null>(null);
  onMount(() => setToday(new Date()));

  const locale = () => props.locale ?? "en-US";
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

  const startMonth = () =>
    props.startMonth
      ? startOfMonth(props.startMonth)
      : hasYearDropdown()
      ? new Date(now.getFullYear() - 100, 0, 1)
      : undefined;
  const endMonth = () =>
    props.endMonth
      ? startOfMonth(props.endMonth)
      : hasYearDropdown()
      ? new Date(now.getFullYear(), 11, 1)
      : undefined;
  const isMonthInBounds = (month: Date) => {
    const start = startMonth();
    const end = endMonth();
    return (!start || month >= start) && (!end || month <= end);
  };

  const navButtonClass = () =>
    cn(
      buttonVariants({ variant: props.buttonVariant ?? "ghost" }),
      "size-(--cell-size) select-none p-0 aria-disabled:opacity-50",
    );

  return (
    <CalendarPrimitive {...props}>
      {(calendar: RootChildrenProps) => {
        const canGoPrev = () => {
          const start = startMonth();
          return !start || startOfMonth(calendar.month) > start;
        };
        const canGoNext = () => {
          const end = endMonth();
          const last = new Date(
            calendar.month.getFullYear(),
            calendar.month.getMonth() + calendar.numberOfMonths - 1,
            1,
          );
          return !end || last < end;
        };

        const isSelected = (day: Date) => {
          switch (calendar.mode) {
            case "single":
              return isSameDay(day, calendar.value);
            case "multiple":
              return calendar.value.some((value) => isSameDay(day, value));
            case "range": {
              const { from, to } = calendar.value;
              if (!from) return false;
              if (!to) return isSameDay(day, from);
              const date = startOfDay(day);
              return date >= startOfDay(from) && date <= startOfDay(to);
            }
          }
        };

        const getModifiers = (day: Date, month: Date): CalendarModifiers => {
          const outside = !isSameMonth(day, month);
          const range = calendar.mode === "range" ? calendar.value : null;
          const from = range?.from ?? null;
          const to = range?.to ?? null;
          const hasRange = !!from && !!to;
          const date = startOfDay(day);
          const modifiers: CalendarModifiers = {
            selected: isSelected(day),
            rangeStart: hasRange && isSameDay(day, from),
            rangeEnd: hasRange && isSameDay(day, to),
            rangeMiddle: hasRange &&
              date > startOfDay(from) &&
              date < startOfDay(to),
            today: isSameDay(day, today()),
            outside,
            disabled: props.disabled?.(day) ?? false,
            hidden: outside && !showOutsideDays(),
          };
          for (const [name, matcher] of Object.entries(props.modifiers ?? {})) {
            modifiers[name] = matcher(day);
          }
          return modifiers;
        };

        const dayClass = (modifiers: CalendarModifiers) =>
          cn(
            "group/day relative aspect-square h-full w-full select-none rounded-(--cell-radius) p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
            props.showWeekNumber
              ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
              : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
            modifiers.disabled && "text-muted-foreground opacity-50",
            modifiers.hidden && "invisible",
            modifiers.outside &&
              "text-muted-foreground aria-selected:text-muted-foreground",
            modifiers.today &&
              "rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none",
            modifiers.rangeStart &&
              "relative isolate z-0 rounded-l-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted",
            modifiers.rangeEnd &&
              "relative isolate z-0 rounded-r-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted",
            modifiers.rangeMiddle && "rounded-none",
            ...Object.entries(props.modifiersClassNames ?? {})
              .filter(([name]) => modifiers[name])
              .map(([, className]) => className),
          );

        const dayLabel = (day: Date, modifiers: CalendarModifiers) => {
          let label = day.toLocaleDateString(locale(), {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          });
          if (modifiers.today) label += ", Today";
          if (modifiers.selected) label += ", selected";
          return label;
        };

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
          const start = startMonth()?.getFullYear() ?? month.getFullYear();
          const end = endMonth()?.getFullYear() ?? month.getFullYear();
          return Array.from(
            { length: Math.max(0, end - start + 1) },
            (_, index) => {
              const value = new Date(start + index, month.getMonth(), 1);
              return {
                value: start + index,
                label: formatters().formatYearDropdown(value, locale()),
                disabled: false,
              };
            },
          );
        };

        const goToMonth = (month: Date, offset: number) => {
          calendar.setMonth(
            new Date(month.getFullYear(), month.getMonth() - offset, 1),
          );
        };

        return (
          <div
            data-slot="calendar"
            class={cn(
              "cn-calendar group/calendar w-fit bg-background in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
              props.class,
            )}
          >
            <div class="relative flex flex-col gap-4 md:flex-row">
              <nav class="absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1">
                <CalendarPrimitive.Nav
                  action="prev-month"
                  aria-label="Go to the Previous Month"
                  aria-disabled={canGoPrev() ? undefined : true}
                  tabIndex={canGoPrev() ? undefined : -1}
                  class={navButtonClass()}
                  onClick={(event) => {
                    if (!canGoPrev()) event.preventDefault();
                  }}
                >
                  <IconPlaceholder
                    lucide="chevron-left"
                    tabler="chevron-left"
                    ph="caret-left"
                    ri="arrow-left-s-line"
                    hugeicons="arrow-left-01"
                    class="cn-rtl-flip size-4"
                  />
                </CalendarPrimitive.Nav>
                <CalendarPrimitive.Nav
                  action="next-month"
                  aria-label="Go to the Next Month"
                  aria-disabled={canGoNext() ? undefined : true}
                  tabIndex={canGoNext() ? undefined : -1}
                  class={navButtonClass()}
                  onClick={(event) => {
                    if (!canGoNext()) event.preventDefault();
                  }}
                >
                  <IconPlaceholder
                    lucide="chevron-right"
                    tabler="chevron-right"
                    ph="caret-right"
                    ri="arrow-right-s-line"
                    hugeicons="arrow-right-01"
                    class="cn-rtl-flip size-4"
                  />
                </CalendarPrimitive.Nav>
              </nav>
              <Index each={calendar.months}>
                {(item, index) => (
                  <div class="flex w-full flex-col gap-4">
                    <div class="flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)">
                      <Show
                        when={hasDropdown()}
                        fallback={
                          <CalendarPrimitive.Label
                            as="span"
                            index={index}
                            class="cn-calendar-caption select-none font-medium text-sm"
                          >
                            {formatters().formatCaption(
                              item().month,
                              locale(),
                            )}
                          </CalendarPrimitive.Label>
                        }
                      >
                        <div class="flex h-(--cell-size) w-full items-center justify-center gap-1.5 font-medium text-sm">
                          <Show
                            when={hasMonthDropdown()}
                            fallback={
                              <span>
                                {formatters().formatMonthDropdown(
                                  item().month,
                                  locale(),
                                )}
                              </span>
                            }
                          >
                            <span class="cn-calendar-dropdown-root relative rounded-(--cell-radius)">
                              <select
                                aria-label="Choose the Month"
                                class="absolute inset-0 bg-popover opacity-0"
                                onChange={(event) =>
                                  goToMonth(
                                    new Date(
                                      item().month.getFullYear(),
                                      Number(event.currentTarget.value),
                                      1,
                                    ),
                                    index,
                                  )}
                              >
                                <Index each={monthOptions(item().month)}>
                                  {(option) => (
                                    <option
                                      value={option().value}
                                      disabled={option().disabled}
                                      selected={option().value ===
                                        item().month.getMonth()}
                                    >
                                      {option().label}
                                    </option>
                                  )}
                                </Index>
                              </select>
                              <span
                                aria-hidden="true"
                                class="cn-calendar-caption-label flex select-none items-center gap-1 rounded-(--cell-radius) font-medium text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground"
                              >
                                {formatters().formatMonthDropdown(
                                  item().month,
                                  locale(),
                                )}
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
                              <span>
                                {formatters().formatYearDropdown(
                                  item().month,
                                  locale(),
                                )}
                              </span>
                            }
                          >
                            <span class="cn-calendar-dropdown-root relative rounded-(--cell-radius)">
                              <select
                                aria-label="Choose the Year"
                                class="absolute inset-0 bg-popover opacity-0"
                                onChange={(event) =>
                                  goToMonth(
                                    new Date(
                                      Number(event.currentTarget.value),
                                      item().month.getMonth(),
                                      1,
                                    ),
                                    index,
                                  )}
                              >
                                <Index each={yearOptions(item().month)}>
                                  {(option) => (
                                    <option
                                      value={option().value}
                                      disabled={option().disabled}
                                      selected={option().value ===
                                        item().month.getFullYear()}
                                    >
                                      {option().label}
                                    </option>
                                  )}
                                </Index>
                              </select>
                              <span
                                aria-hidden="true"
                                class="cn-calendar-caption-label flex select-none items-center gap-1 rounded-(--cell-radius) font-medium text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground"
                              >
                                {formatters().formatYearDropdown(
                                  item().month,
                                  locale(),
                                )}
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
                          <CalendarPrimitive.Label
                            as="span"
                            index={index}
                            class="sr-only"
                          >
                            {formatters().formatCaption(
                              item().month,
                              locale(),
                            )}
                          </CalendarPrimitive.Label>
                        </div>
                      </Show>
                    </div>
                    <CalendarPrimitive.Table
                      index={index}
                      class="w-full border-collapse"
                    >
                      <thead aria-hidden="true">
                        <tr class="flex">
                          <Show when={props.showWeekNumber}>
                            <th
                              aria-label="Week Number"
                              class="w-(--cell-size) select-none"
                            />
                          </Show>
                          <Index each={calendar.weekdays}>
                            {(weekday) => (
                              <CalendarPrimitive.HeadCell
                                aria-label={weekday().toLocaleDateString(
                                  locale(),
                                  { weekday: "long" },
                                )}
                                class="flex-1 select-none rounded-(--cell-radius) font-normal text-muted-foreground text-[0.8rem]"
                              >
                                {formatters().formatWeekdayName(
                                  weekday(),
                                  locale(),
                                )}
                              </CalendarPrimitive.HeadCell>
                            )}
                          </Index>
                        </tr>
                      </thead>
                      <tbody>
                        <Index each={item().weeks}>
                          {(week) => (
                            <tr class="mt-2 flex w-full">
                              <Show when={props.showWeekNumber}>
                                <td class="select-none text-muted-foreground text-[0.8rem]">
                                  <div class="flex size-(--cell-size) items-center justify-center text-center">
                                    {formatters().formatWeekNumber(
                                      getWeekNumber(week()[0]),
                                      locale(),
                                    )}
                                  </div>
                                </td>
                              </Show>
                              <Index each={week()}>
                                {(day) => {
                                  const modifiers = () =>
                                    getModifiers(day(), item().month);
                                  return (
                                    <CalendarPrimitive.Cell
                                      class={dayClass(modifiers())}
                                      data-day={toDateKey(day())}
                                      data-selected={modifiers().selected ||
                                        undefined}
                                      data-disabled={modifiers().disabled ||
                                        undefined}
                                      data-hidden={modifiers().hidden ||
                                        undefined}
                                      data-outside={modifiers().outside ||
                                        undefined}
                                      data-today={modifiers().today ||
                                        undefined}
                                    >
                                      <Show when={!modifiers().hidden}>
                                        <Dynamic
                                          component={props.components
                                            ?.DayButton ?? CalendarDayButton}
                                          day={day()}
                                          month={item().month}
                                          modifiers={modifiers()}
                                          data-day={day().toLocaleDateString(
                                            locale(),
                                          )}
                                          aria-label={dayLabel(
                                            day(),
                                            modifiers(),
                                          )}
                                        >
                                          {formatters().formatDay(
                                            day(),
                                            locale(),
                                          )}
                                        </Dynamic>
                                      </Show>
                                    </CalendarPrimitive.Cell>
                                  );
                                }}
                              </Index>
                            </tr>
                          )}
                        </Index>
                      </tbody>
                    </CalendarPrimitive.Table>
                  </div>
                )}
              </Index>
            </div>
          </div>
        );
      }}
    </CalendarPrimitive>
  );
};

const CalendarDayButton: Component<CalendarDayButtonProps> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "day",
    "month",
    "modifiers",
    "children",
  ]);

  return (
    <CalendarPrimitive.CellTrigger
      day={local.day}
      month={local.month}
      data-selected-single={local.modifiers.selected &&
        !local.modifiers.rangeStart &&
        !local.modifiers.rangeEnd &&
        !local.modifiers.rangeMiddle}
      data-range-start={local.modifiers.rangeStart}
      data-range-end={local.modifiers.rangeEnd}
      data-range-middle={local.modifiers.rangeMiddle}
      data-outside={local.modifiers.outside}
      class={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "cn-calendar-day-button relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 font-normal leading-none focus-visible:relative focus-visible:z-10 dark:hover:text-foreground data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-end=true]:bg-primary data-[range-middle=true]:bg-muted data-[range-start=true]:bg-primary data-[selected-single=true]:bg-primary [&>span]:text-xs data-[range-end=true]:text-primary-foreground data-[range-middle=true]:text-foreground data-[range-start=true]:text-primary-foreground data-[selected-single=true]:text-primary-foreground [&>span]:opacity-70 data-[outside=true]:opacity-100",
        local.class,
      )}
      {...others}
    >
      {local.children}
    </CalendarPrimitive.CellTrigger>
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
