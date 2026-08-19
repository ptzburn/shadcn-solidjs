import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Calendar } from "~/registry/ui/calendar.tsx";
import { Card, CardContent, CardFooter } from "~/registry/ui/card.tsx";
import { Field, FieldGroup, FieldLabel } from "~/registry/ui/field.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/registry/ui/input-group.tsx";

import { createSignal } from "solid-js";

export default function CalendarTime() {
  const [date, setDate] = createSignal<Date | null>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 12),
  );

  return (
    <Card size="sm" class="mx-auto w-fit">
      <CardContent>
        <Calendar
          mode="single"
          value={date()}
          onValueChange={setDate}
          class="p-0"
        />
      </CardContent>
      <CardFooter class="border-t bg-card">
        <FieldGroup>
          <Field>
            <FieldLabel for="time-from">Start Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="time-from"
                type="time"
                step="1"
                value="10:30:00"
                class="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <IconPlaceholder
                  lucide="clock-2"
                  tabler="clock-hour-2"
                  ph="clock"
                  ri="time-line"
                  hugeicons="clock-03"
                  class="text-muted-foreground"
                />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel for="time-to">End Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="time-to"
                type="time"
                step="1"
                value="12:30:00"
                class="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <IconPlaceholder
                  lucide="clock-2"
                  tabler="clock-hour-2"
                  ph="clock"
                  ri="time-line"
                  hugeicons="clock-03"
                  class="text-muted-foreground"
                />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </CardFooter>
    </Card>
  );
}
