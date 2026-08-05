import { children, Show, splitProps } from "solid-js";

import { DatePicker as DatePickerPrimitive } from "@ark-ui/solid";

import { cn } from "~/lib/utils.ts";
import { buttonVariants } from "~/registry/ui/button.tsx";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

const DatePicker = DatePickerPrimitive.Root;
const DatePickerLabel = DatePickerPrimitive.Label;
const DatePickerContext = DatePickerPrimitive.Context;
const DatePickerTableHead = DatePickerPrimitive.TableHead;
const DatePickerTableBody = DatePickerPrimitive.TableBody;
const DatePickerYearSelect = DatePickerPrimitive.YearSelect;
const DatePickerMonthSelect = DatePickerPrimitive.MonthSelect;
const DatePickerPositioner = DatePickerPrimitive.Positioner;

const DatePickerControl = (props: DatePickerPrimitive.ControlProps) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.Control
      class={cn("inline-flex items-center gap-1", local.class)}
      {...others}
    />
  );
};

const DatePickerInput = (props: DatePickerPrimitive.InputProps) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.Input
      class={cn(
        "h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm transition-shadow placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        local.class,
      )}
      {...others}
    />
  );
};

const DatePickerTrigger = (props: DatePickerPrimitive.TriggerProps) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  // prevents rendering children twice
  const resolvedChildren = children(() => local.children);
  const hasChildren = () => resolvedChildren.toArray().length !== 0;

  return (
    <DatePickerPrimitive.Trigger
      class={cn(
        "flex min-h-9 min-w-9 items-center justify-center rounded-md border border-border bg-background transition-[box-shadow,background-color] hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>svg]:size-4",
        local.class,
      )}
      {...others}
    >
      <Show when={!hasChildren()} fallback={resolvedChildren()}>
        <IconPlaceholder
          lucide="calendar"
          tabler="calendar"
          ph="calendar-blank"
          ri="calendar-line"
          hugeicons="calendar-03"
          class="size-4"
        />
      </Show>
    </DatePickerPrimitive.Trigger>
  );
};

const DatePickerContent = (props: DatePickerPrimitive.ContentProps) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <DatePickerPrimitive.Content
      class={cn(
        "z-50 rounded-md border bg-popover p-3 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        local.class,
      )}
      {...others}
    >
      {local.children}
    </DatePickerPrimitive.Content>
  );
};

const DatePickerView = (props: DatePickerPrimitive.ViewProps) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.View
      class={cn("space-y-4", local.class)}
      {...others}
    />
  );
};

const DatePickerViewControl = (props: DatePickerPrimitive.ViewControlProps) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.ViewControl
      class={cn("flex items-center justify-between gap-4", local.class)}
      {...others}
    />
  );
};

const DatePickerPrevTrigger = (props: DatePickerPrimitive.PrevTriggerProps) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  // prevents rendering children twice
  const resolvedChildren = children(() => local.children);
  const hasChildren = () => resolvedChildren.toArray().length !== 0;

  return (
    <DatePickerPrimitive.PrevTrigger
      class={cn(
        buttonVariants({
          variant: "outline",
        }),
        "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        local.class,
      )}
      {...others}
    >
      <Show when={!hasChildren()} fallback={resolvedChildren()}>
        <IconPlaceholder
          lucide="chevron-left"
          tabler="chevron-left"
          ph="caret-left"
          ri="arrow-left-s-line"
          hugeicons="arrow-left-01"
          class="size-4"
        />
      </Show>
    </DatePickerPrimitive.PrevTrigger>
  );
};

const DatePickerNextTrigger = (props: DatePickerPrimitive.NextTriggerProps) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  // prevents rendering children twice
  const resolvedChildren = children(() => local.children);
  const hasChildren = () => resolvedChildren.toArray().length !== 0;

  return (
    <DatePickerPrimitive.NextTrigger
      class={cn(
        buttonVariants({
          variant: "outline",
        }),
        "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        local.class,
      )}
      {...others}
    >
      <Show when={!hasChildren()} fallback={resolvedChildren()}>
        <IconPlaceholder
          lucide="chevron-right"
          tabler="chevron-right"
          ph="caret-right"
          ri="arrow-right-s-line"
          hugeicons="arrow-right-01"
          class="size-4"
        />
      </Show>
    </DatePickerPrimitive.NextTrigger>
  );
};

const DatePickerViewTrigger = (props: DatePickerPrimitive.ViewTriggerProps) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.ViewTrigger
      class={cn(buttonVariants({ variant: "ghost" }), "h-7", local.class)}
      {...others}
    />
  );
};

const DatePickerRangeText = (props: DatePickerPrimitive.RangeTextProps) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.RangeText
      class={cn("text-sm font-medium", local.class)}
      {...others}
    />
  );
};

const DatePickerTable = (props: DatePickerPrimitive.TableProps) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.Table
      class={cn("w-full border-collapse space-y-1", local.class)}
      {...others}
    />
  );
};

const DatePickerTableRow = (props: DatePickerPrimitive.TableRowProps) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.TableRow
      class={cn("mt-2 flex w-full", local.class)}
      {...others}
    />
  );
};

const DatePickerTableHeader = (props: DatePickerPrimitive.TableHeaderProps) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.TableHeader
      class={cn(
        "w-8 flex-1 text-[0.8rem] font-normal text-muted-foreground",
        local.class,
      )}
      {...others}
    />
  );
};

const DatePickerTableCell = (props: DatePickerPrimitive.TableCellProps) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.TableCell
      class={cn(
        "flex-1 p-0 text-center text-sm has-[[data-range-end]]:rounded-r-md has-[[data-range-start]]:rounded-l-md has-[[data-in-range]]:bg-accent has-[[data-outside-range][data-in-range]]:bg-accent/50 has-[[data-in-range]]:first-of-type:rounded-l-md has-[[data-in-range]]:last-of-type:rounded-r-md",
        local.class,
      )}
      {...others}
    />
  );
};

const DatePickerTableCellTrigger = (
  props: DatePickerPrimitive.TableCellTriggerProps,
) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <DatePickerPrimitive.TableCellTrigger
      class={cn(
        buttonVariants({ variant: "ghost" }),
        "size-8 w-full p-0 font-normal data-[selected]:opacity-100",
        "data-[today]:bg-accent data-[today]:text-accent-foreground",
        "[&:is([data-today][data-selected])]:bg-primary [&:is([data-today][data-selected])]:text-primary-foreground",
        "data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground",
        "data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
        "data-[outside-range]:text-muted-foreground data-[outside-range]:opacity-50",
        "[&:is([data-outside-range][data-in-range])]:bg-accent/50 [&:is([data-outside-range][data-in-range])]:text-muted-foreground [&:is([data-outside-range][data-in-range])]:opacity-30",
        local.class,
      )}
      {...others}
    />
  );
};

export {
  DatePicker,
  DatePickerContent,
  DatePickerContext,
  DatePickerControl,
  DatePickerInput,
  DatePickerLabel,
  DatePickerMonthSelect,
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
  DatePickerYearSelect,
};
