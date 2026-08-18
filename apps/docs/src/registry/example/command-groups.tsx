import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { CommandDialog } from "~/registry/ui/command.tsx";
import { createSignal } from "solid-js";

export default function CommandWithGroups() {
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
            heading: "Suggestions",
            options: [
              {
                value: "calendar",
                label: "Calendar",
                icon: () => (
                  <IconPlaceholder
                    lucide="calendar"
                    tabler="calendar"
                    ph="calendar-blank"
                    ri="calendar-line"
                    hugeicons="calendar-03"
                  />
                ),
              },
              {
                value: "search-emoji",
                label: "Search Emoji",
                icon: () => (
                  <IconPlaceholder
                    lucide="smile"
                    tabler="mood-smile"
                    ph="smiley"
                    ri="emotion-happy-line"
                    hugeicons="smile"
                  />
                ),
              },
              {
                value: "calculator",
                label: "Calculator",
                icon: () => (
                  <IconPlaceholder
                    lucide="calculator"
                    tabler="calculator"
                    ph="calculator"
                    ri="calculator-line"
                    hugeicons="calculator"
                  />
                ),
              },
            ],
          },
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
