import { Field, FieldDescription, FieldLabel } from "~/registry/ui/field.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/registry/ui/select.tsx";

const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Customer Support",
  "Human Resources",
  "Finance",
  "Operations",
];

export default function FieldSelect() {
  return (
    <Field class="w-full max-w-xs">
      <FieldLabel>Department</FieldLabel>
      <Select
        options={DEPARTMENTS}
        placeholder="Choose department"
        itemComponent={(props) => (
          <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
        )}
      >
        <SelectTrigger aria-label="Department">
          <SelectValue<string>>
            {(state) => state.selectedOption()}
          </SelectValue>
        </SelectTrigger>
        <SelectContent />
      </Select>
      <FieldDescription>
        Select your department or area of work.
      </FieldDescription>
    </Field>
  );
}
