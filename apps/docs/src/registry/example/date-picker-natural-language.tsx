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
import { parseDate } from "chrono-node";

import { createSignal } from "solid-js";

const formatDate = (date: Date | null) =>
  date
    ? date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    : "";

export default function DatePickerNaturalLanguage() {
  const initial = parseDate("In 2 days");
  const [open, setOpen] = createSignal(false);
  const [value, setValue] = createSignal("In 2 days");
  const [date, setDate] = createSignal<Date | null>(initial);
  const [month, setMonth] = createSignal(initial ?? new Date());

  return (
    <Field class="mx-auto max-w-xs">
      <FieldLabel for="date-picker-natural-language">Schedule Date</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="date-picker-natural-language"
          value={value()}
          placeholder="Tomorrow or next week"
          onInput={(event) => {
            setValue(event.currentTarget.value);
            const parsed = parseDate(event.currentTarget.value);
            if (parsed) {
              setDate(parsed);
              setMonth(parsed);
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
                captionLayout="dropdown"
                onValueChange={(next) => {
                  setDate(next);
                  setValue(formatDate(next));
                  if (next) setMonth(next);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
      <p class="px-1 text-muted-foreground text-sm">
        Your post will be published on{" "}
        <span class="font-medium">{formatDate(date())}</span>.
      </p>
    </Field>
  );
}
