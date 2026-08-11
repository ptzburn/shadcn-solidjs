import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

import { ButtonGroup } from "~/registry/ui/button-group.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { Input } from "~/registry/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/registry/ui/select.tsx";
import { createSignal } from "solid-js";

type Currency = {
  value: string;
  label: string;
};

const CURRENCIES: Currency[] = [
  {
    value: "$",
    label: "US Dollar",
  },
  {
    value: "€",
    label: "Euro",
  },
  {
    value: "£",
    label: "British Pound",
  },
];

export default function ButtonGroupSelect() {
  const [currency, setCurrency] = createSignal<Currency | null>(CURRENCIES[0]);

  return (
    <ButtonGroup>
      <ButtonGroup>
        <Select
          value={currency()}
          onChange={setCurrency}
          options={CURRENCIES}
          optionValue="value"
          optionTextValue="label"
          itemComponent={(props) => (
            <SelectItem item={props.item}>
              {props.item.rawValue.value}{" "}
              <span class="text-muted-foreground">
                {props.item.rawValue.label}
              </span>
            </SelectItem>
          )}
        >
          <SelectTrigger aria-label="Currency" class="font-mono">
            <SelectValue<Currency>>
              {(state) => state.selectedOption().value}
            </SelectValue>
          </SelectTrigger>
          <SelectContent class="min-w-24" />
        </Select>
        <Input placeholder="10.00" pattern="[0-9]*" />
      </ButtonGroup>
      <ButtonGroup>
        <Button aria-label="Send" size="icon" variant="outline">
          <IconPlaceholder
            lucide="arrow-right"
            tabler="arrow-right"
            ph="arrow-right"
            ri="arrow-right-line"
            hugeicons="arrow-right-02"
          />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  );
}
