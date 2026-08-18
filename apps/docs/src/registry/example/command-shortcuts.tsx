import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { CommandDialog } from "~/registry/ui/command.tsx";
import { createSignal } from "solid-js";

export default function CommandWithShortcuts() {
  const [open, setOpen] = createSignal(false);

  return (
    <div class="flex flex-col gap-4">
      <Button onClick={() => setOpen(true)} variant="outline" class="w-fit">
        Open Menu
      </Button>
      <CommandDialog
        open={open()}
        onOpenChange={setOpen}
        options={[
          {
            heading: "Settings",
            options: [
              {
                value: "profile",
                label: "Profile",
                shortcut: "⌘P",
                icon: () => (
                  <IconPlaceholder
                    lucide="user"
                    tabler="user"
                    ph="user"
                    ri="user-line"
                    hugeicons="user"
                  />
                ),
              },
              {
                value: "billing",
                label: "Billing",
                shortcut: "⌘B",
                icon: () => (
                  <IconPlaceholder
                    lucide="credit-card"
                    tabler="credit-card"
                    ph="credit-card"
                    ri="bank-card-line"
                    hugeicons="credit-card"
                  />
                ),
              },
              {
                value: "settings",
                label: "Settings",
                shortcut: "⌘S",
                icon: () => (
                  <IconPlaceholder
                    lucide="settings"
                    tabler="settings"
                    ph="gear"
                    ri="settings-3-line"
                    hugeicons="settings-01"
                  />
                ),
              },
            ],
          },
        ]}
      />
    </div>
  );
}
