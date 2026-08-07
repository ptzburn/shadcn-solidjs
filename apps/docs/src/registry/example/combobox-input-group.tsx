import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSection,
} from "~/registry/ui/combobox.tsx";
import { InputGroupAddon } from "~/registry/ui/input-group.tsx";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

interface Timezone {
  value: string;
  items: string[];
}

const timezones: Timezone[] = [
  {
    value: "Americas",
    items: [
      "(GMT-5) New York",
      "(GMT-8) Los Angeles",
      "(GMT-6) Chicago",
      "(GMT-5) Toronto",
      "(GMT-8) Vancouver",
      "(GMT-3) São Paulo",
    ],
  },
  {
    value: "Europe",
    items: [
      "(GMT+0) London",
      "(GMT+1) Paris",
      "(GMT+1) Berlin",
      "(GMT+1) Rome",
      "(GMT+1) Madrid",
      "(GMT+1) Amsterdam",
    ],
  },
  {
    value: "Asia/Pacific",
    items: [
      "(GMT+9) Tokyo",
      "(GMT+8) Shanghai",
      "(GMT+8) Singapore",
      "(GMT+4) Dubai",
      "(GMT+11) Sydney",
      "(GMT+9) Seoul",
    ],
  },
];

export default function ComboboxInputGroup() {
  return (
    <Combobox<string, Timezone>
      options={timezones}
      optionGroupChildren="items"
      allowsEmptyCollection
      sameWidth={false}
      placement="bottom-start"
      itemComponent={(props) => (
        <ComboboxItem item={props.item}>{props.item.rawValue}</ComboboxItem>
      )}
      sectionComponent={(props) => (
        <ComboboxSection>{props.section.rawValue.value}</ComboboxSection>
      )}
    >
      <ComboboxInput placeholder="Select a timezone">
        <InputGroupAddon>
          <IconPlaceholder
            lucide="globe"
            tabler="world"
            ph="globe"
            ri="global-line"
            hugeicons="globe-02"
          />
        </InputGroupAddon>
      </ComboboxInput>
      <ComboboxContent class="w-60">
        <ComboboxEmpty>No timezones found.</ComboboxEmpty>
        <ComboboxList />
      </ComboboxContent>
    </Combobox>
  );
}
