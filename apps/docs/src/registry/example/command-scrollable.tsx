import { Command } from "~/registry/ui/command.tsx";

export default function CommandScrollable() {
  return (
    <Command
      class="max-w-sm rounded-lg border"
      options={[
        {
          heading: "Navigation",
          options: [
            { value: "home", label: "Home", shortcut: "⌘H" },
            { value: "inbox", label: "Inbox", shortcut: "⌘I" },
            { value: "documents", label: "Documents", shortcut: "⌘D" },
            { value: "folders", label: "Folders", shortcut: "⌘F" },
          ],
        },
        {
          heading: "Actions",
          options: [
            { value: "new-file", label: "New File", shortcut: "⌘N" },
            { value: "new-folder", label: "New Folder", shortcut: "⇧⌘N" },
            { value: "upload", label: "Upload" },
            { value: "download", label: "Download" },
            { value: "share", label: "Share" },
          ],
        },
        {
          heading: "Preferences",
          options: [
            { value: "appearance", label: "Appearance" },
            { value: "notifications", label: "Notifications" },
            { value: "privacy", label: "Privacy" },
            { value: "advanced", label: "Advanced" },
          ],
        },
      ]}
    />
  );
}
