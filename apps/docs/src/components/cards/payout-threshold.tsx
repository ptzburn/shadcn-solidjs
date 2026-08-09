import IconCancel01 from "~icons/hugeicons/cancel-01";

import { Button } from "~/registry/ui/button.tsx";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/registry/ui/card.tsx";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/registry/ui/field.tsx";
import { Progress } from "~/registry/ui/progress.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/registry/ui/select.tsx";
import { Textarea } from "~/registry/ui/textarea.tsx";

type Currency = { label: string; value: string };

const CURRENCIES: Currency[] = [
  { label: "USD — United States Dollar", value: "usd" },
  { label: "EUR — Euro", value: "eur" },
  { label: "GBP — British Pound", value: "gbp" },
  { label: "JPY — Japanese Yen", value: "jpy" },
];

export function PayoutThreshold() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout Threshold</CardTitle>
        <CardDescription>
          Set the minimum balance required before a payout is triggered.
        </CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-sm"
            class="bg-muted"
            aria-label="Dismiss payout threshold"
          >
            <IconCancel01 />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel for="preferred-currency">Preferred Currency</FieldLabel>
            <Select<Currency>
              class="w-full"
              options={CURRENCIES}
              optionValue="value"
              optionTextValue="label"
              defaultValue={CURRENCIES[0]}
              itemComponent={(props) => (
                <SelectItem item={props.item}>
                  {props.item.rawValue.label}
                </SelectItem>
              )}
            >
              <SelectTrigger id="preferred-currency" class="w-full">
                <SelectValue<Currency>>
                  {(state) => state.selectedOption().label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
          </Field>
          <Field>
            <div class="flex items-baseline justify-between">
              <FieldLabel id="min-payout-label">
                Minimum Payout Amount
              </FieldLabel>
              <span class="text-2xl font-semibold tabular-nums">$2500.00</span>
            </div>
            <Progress
              value={25}
              aria-labelledby="min-payout-label"
              aria-valuetext="$2,500 of $10,000"
            />
            <div class="flex items-center justify-between">
              <FieldDescription>$50 (MIN)</FieldDescription>
              <FieldDescription>$10,000 (MAX)</FieldDescription>
            </div>
          </Field>
          <Field>
            <FieldLabel for="payout-notes">Notes</FieldLabel>
            <Textarea
              id="payout-notes"
              placeholder="Add any notes for this payout configuration..."
              class="min-h-[100px]"
            />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Button class="w-full">Save Threshold</Button>
      </CardFooter>
    </Card>
  );
}
