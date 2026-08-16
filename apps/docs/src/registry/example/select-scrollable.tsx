import {
  Select,
  SelectContent,
  SelectItem,
  SelectSection,
  SelectTrigger,
  SelectValue,
} from "~/registry/ui/select.tsx";

type Region = {
  label: string;
  timezones: string[];
};

const REGIONS: Region[] = [
  {
    label: "North America",
    timezones: [
      "Eastern Standard Time",
      "Central Standard Time",
      "Mountain Standard Time",
      "Pacific Standard Time",
      "Alaska Standard Time",
      "Hawaii Standard Time",
    ],
  },
  {
    label: "Europe & Africa",
    timezones: [
      "Greenwich Mean Time",
      "Central European Time",
      "Eastern European Time",
      "Western European Summer Time",
      "Central Africa Time",
      "East Africa Time",
    ],
  },
  {
    label: "Asia",
    timezones: [
      "Moscow Time",
      "India Standard Time",
      "China Standard Time",
      "Japan Standard Time",
      "Korea Standard Time",
      "Indonesia Central Standard Time",
    ],
  },
  {
    label: "Australia & Pacific",
    timezones: [
      "Australian Western Standard Time",
      "Australian Central Standard Time",
      "Australian Eastern Standard Time",
      "New Zealand Standard Time",
      "Fiji Time",
    ],
  },
  {
    label: "South America",
    timezones: [
      "Argentina Time",
      "Bolivia Time",
      "Brasilia Time",
      "Chile Standard Time",
    ],
  },
];

export default function SelectScrollable() {
  return (
    <Select<string, Region>
      class="w-full max-w-64"
      options={REGIONS}
      optionGroupChildren="timezones"
      placeholder="Select a timezone"
      itemComponent={(props) => (
        <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
      )}
      sectionComponent={(props) => (
        <SelectSection>{props.section.rawValue.label}</SelectSection>
      )}
    >
      <SelectTrigger aria-label="Timezone" class="w-full">
        <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
}
