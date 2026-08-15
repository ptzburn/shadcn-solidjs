import { Button } from "~/registry/ui/button.tsx";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/registry/ui/field.tsx";
import { Input } from "~/registry/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/registry/ui/select.tsx";

type Country = {
  value: string;
  label: string;
};

const COUNTRIES: Country[] = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
];

export default function InputForm() {
  return (
    <form class="w-full max-w-sm">
      <FieldGroup>
        <Field>
          <FieldLabel for="form-name">Name</FieldLabel>
          <Input
            id="form-name"
            type="text"
            placeholder="Evil Rabbit"
            required
          />
        </Field>
        <Field>
          <FieldLabel for="form-email">Email</FieldLabel>
          <Input id="form-email" type="email" placeholder="john@example.com" />
          <FieldDescription>
            We&apos;ll never share your email with anyone.
          </FieldDescription>
        </Field>
        <div class="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel for="form-phone">Phone</FieldLabel>
            <Input id="form-phone" type="tel" placeholder="+1 (555) 123-4567" />
          </Field>
          <Field>
            <FieldLabel for="form-country">Country</FieldLabel>
            <Select
              defaultValue={COUNTRIES[0]}
              options={COUNTRIES}
              optionValue="value"
              optionTextValue="label"
              itemComponent={(props) => (
                <SelectItem item={props.item}>
                  {props.item.rawValue.label}
                </SelectItem>
              )}
            >
              <SelectTrigger id="form-country" aria-label="Country">
                <SelectValue<Country>>
                  {(state) => state.selectedOption().label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
          </Field>
        </div>
        <Field>
          <FieldLabel for="form-address">Address</FieldLabel>
          <Input id="form-address" type="text" placeholder="123 Main St" />
        </Field>
        <Field orientation="horizontal">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
