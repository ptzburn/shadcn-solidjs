import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/registry/ui/select.tsx";

const FRUITS = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"];

export default function SelectDisabled() {
  return (
    <Select
      disabled
      class="w-full max-w-48"
      options={FRUITS}
      optionDisabled={(fruit) => fruit === "Grapes"}
      placeholder="Select a fruit"
      itemComponent={(props) => (
        <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
      )}
    >
      <SelectTrigger aria-label="Fruit" class="w-full">
        <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
}
