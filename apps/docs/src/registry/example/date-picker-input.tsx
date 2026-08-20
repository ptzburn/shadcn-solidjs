import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Calendar } from "~/registry/ui/calendar.tsx";
import { Field, FieldLabel } from "~/registry/ui/field.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/registry/ui/input-group.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/registry/ui/popover.tsx";

import { createSignal } from "solid-js";

const formatDate = (date: Date | null) =>
  date
    ? date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    : "";

const isValidDate = (date: Date) => !Number.isNaN(date.getTime());

export default function DatePickerInput() {
  const initial = new Date(2025, 5, 1);
  const [open, setOpen] = createSignal(false);
  const [date, setDate] = createSignal<Date | null>(initial);
  const [month, setMonth] = createSignal(initial);
  const [value, setValue] = createSignal(formatDate(initial));

  return (
    <Field class="mx-auto w-48">
      <FieldLabel for="date-picker-input">Subscription Date</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="date-picker-input"
          value={value()}
          placeholder="June 01, 2025"
          onInput={(event) => {
            const next = new Date(event.currentTarget.value);
            setValue(event.currentTarget.value);
            if (isValidDate(next)) {
              setDate(next);
              setMonth(next);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open()} onOpenChange={setOpen} placement="bottom-end">
            <PopoverTrigger
              as={InputGroupButton<"button">}
              variant="ghost"
              size="icon-xs"
              aria-label="Select date"
            >
              <IconPlaceholder
                lucide="calendar"
                tabler="calendar"
                ph="calendar-blank"
                ri="calendar-line"
                hugeicons="calendar-03"
              />
            </PopoverTrigger>
            <PopoverContent class="w-auto overflow-hidden p-0">
              <Calendar
                mode="single"
                value={date()}
                month={month()}
                onMonthChange={setMonth}
                onValueChange={(next) => {
                  setDate(next);
                  setValue(formatDate(next));
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
