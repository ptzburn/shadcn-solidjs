import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "~/registry/ui/field.tsx";
import { RadioGroup, RadioGroupItem } from "~/registry/ui/radio-group.tsx";

export default function RadioGroupFieldset() {
  return (
    <FieldSet class="w-full max-w-xs">
      <FieldLegend variant="label">Subscription Plan</FieldLegend>
      <FieldDescription>
        Yearly and lifetime plans offer significant savings.
      </FieldDescription>
      <RadioGroup defaultValue="monthly">
        <Field orientation="horizontal">
          <RadioGroupItem value="monthly" id="fieldset-monthly" />
          <FieldLabel for="fieldset-monthly-input" class="font-normal">
            Monthly ($9.99/month)
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="yearly" id="fieldset-yearly" />
          <FieldLabel for="fieldset-yearly-input" class="font-normal">
            Yearly ($99.99/year)
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="lifetime" id="fieldset-lifetime" />
          <FieldLabel for="fieldset-lifetime-input" class="font-normal">
            Lifetime ($299.99)
          </FieldLabel>
        </Field>
      </RadioGroup>
    </FieldSet>
  );
}
