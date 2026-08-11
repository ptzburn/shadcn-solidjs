import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

import { Button } from "~/registry/ui/button.tsx";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/registry/ui/command.tsx";
import { createSignal } from "solid-js";

export default function CommandWithGroups() {
  const [open, setOpen] = createSignal(false);

  return (
    <div class="flex flex-col gap-4">
      <Button onClick={() => setOpen(true)} variant="outline" class="w-fit">
        Open Menu
      </Button>
      <CommandDialog open={open()} onOpenChange={setOpen}>
        <Command>
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
              <CommandItem>
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
      </CommandDialog>
    </div>
  );
}
