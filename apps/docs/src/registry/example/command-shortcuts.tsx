import { createSignal } from "solid-js";

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
  CommandShortcut,
} from "~/registry/ui/command.tsx";

export default function CommandWithShortcuts() {
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
