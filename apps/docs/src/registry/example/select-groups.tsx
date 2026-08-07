import { Show } from "solid-js";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSection,
  SelectSeparator,
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
    items: ["Apple", "Banana", "Blueberry"],
  },
  {
    label: "Vegetables",
    items: ["Carrot", "Broccoli", "Spinach"],
  },
];

export default function SelectGroups() {
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
        <>
          <Show when={props.section.rawValue !== CATEGORIES[0]}>
            <SelectSeparator />
          </Show>
          <SelectSection>{props.section.rawValue.label}</SelectSection>
        </>
      )}
    >
      <SelectTrigger aria-label="Produce" class="w-full">
        <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
}
