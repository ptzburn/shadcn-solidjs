import { Command } from "~/registry/ui/command.tsx";

export default function CommandShortcuts() {
  return (
    <Command
      class="max-w-sm rounded-lg border"
      options={[
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
