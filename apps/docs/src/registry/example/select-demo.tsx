import {
  Select,
  SelectContent,
  SelectItem,
  SelectSection,
  SelectTrigger,
  SelectValue,
} from "~/registry/ui/select.tsx";

type Category = {
  label: string;
  items: string[];
};

const CATEGORIES: Category[] = [
  {
    label: "Fruits",
    items: ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"],
  },
];

export default function SelectDemo() {
  return (
    <Select<string, Category>
      class="w-full max-w-48"
      options={CATEGORIES}
      optionGroupChildren="items"
      placeholder="Select a fruit"
      itemComponent={(props) => (
        <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
      )}
      sectionComponent={(props) => (
        <SelectSection>{props.section.rawValue.label}</SelectSection>
      )}
    >
      <SelectTrigger aria-label="Fruit" class="w-full">
        <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
}
