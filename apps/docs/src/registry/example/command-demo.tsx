import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Command } from "~/registry/ui/command.tsx";

export default function CommandDemo() {
  return (
    <Command
      class="max-w-sm rounded-lg border"
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
              disabled: true,
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
  );
}
