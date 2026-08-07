import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/registry/ui/command.tsx";

export default function CommandDemo() {
  return (
    <Command class="max-w-sm rounded-lg border">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <IconPlaceholder
              lucide="calendar"
              tabler="calendar"
              ph="calendar-blank"
              ri="calendar-line"
              hugeicons="calendar-03"
            />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <IconPlaceholder
              lucide="smile"
              tabler="mood-smile"
              ph="smiley"
              ri="emotion-happy-line"
              hugeicons="smile"
            />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem disabled>
            <IconPlaceholder
              lucide="calculator"
              tabler="calculator"
              ph="calculator"
              ri="calculator-line"
              hugeicons="calculator"
            />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <IconPlaceholder
              lucide="user"
              tabler="user"
              ph="user"
              ri="user-line"
              hugeicons="user"
            />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <IconPlaceholder
              lucide="credit-card"
              tabler="credit-card"
              ph="credit-card"
              ri="bank-card-line"
              hugeicons="credit-card"
            />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <IconPlaceholder
              lucide="settings"
              tabler="settings"
              ph="gear"
              ri="settings-3-line"
              hugeicons="settings-01"
            />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
