import { Field, FieldError, FieldLabel } from "~/registry/ui/field.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/registry/ui/select.tsx";

const FRUITS = ["Apple", "Banana", "Blueberry"];

export default function SelectInvalid() {
  return (
    <Field data-invalid class="w-full max-w-48">
      <FieldLabel>Fruit</FieldLabel>
      <Select
        validationState="invalid"
        options={FRUITS}
        placeholder="Select a fruit"
        itemComponent={(props) => (
          <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
        )}
      >
        <SelectTrigger aria-label="Fruit">
          <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
        </SelectTrigger>
        <SelectContent />
      </Select>
      <FieldError>Please select a fruit.</FieldError>
    </Field>
  );
}
