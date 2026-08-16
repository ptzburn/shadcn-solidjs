import { Command } from "~/registry/ui/command.tsx";

export default function CommandGroups() {
  return (
    <Command
      class="max-w-sm rounded-lg border"
      options={[
        {
          heading: "Suggestions",
          options: [
            { value: "calendar", label: "Calendar" },
            { value: "search-emoji", label: "Search Emoji" },
            { value: "calculator", label: "Calculator" },
          ],
        },
        {
          heading: "Settings",
          options: [
            { value: "profile", label: "Profile", shortcut: "⌘P" },
            { value: "billing", label: "Billing", shortcut: "⌘B" },
            { value: "settings", label: "Settings", shortcut: "⌘S" },
          ],
        },
      ]}
    />
  );
}
