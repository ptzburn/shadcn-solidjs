import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
} from "~/registry/ui/combobox.tsx";

import { For } from "solid-js";

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"];

export default function ComboboxMultiple() {
  return (
    <Combobox
      multiple
      options={frameworks}
      defaultValue={[frameworks[0]]}
      allowsEmptyCollection
      itemComponent={(props) => (
        <ComboboxItem item={props.item}>{props.item.rawValue}</ComboboxItem>
      )}
    >
      <ComboboxChips<string> class="w-full max-w-xs">
        {(state) => (
          <>
            <For each={state.selectedOptions()}>
              {(option) => (
                <ComboboxChip onRemove={() => state.remove(option)}>
                  {option}
                </ComboboxChip>
              )}
            </For>
            <ComboboxChipsInput />
          </>
        )}
      </ComboboxChips>
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList />
      </ComboboxContent>
    </Combobox>
  );
}
