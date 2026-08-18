import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { CommandDialog } from "~/registry/ui/command.tsx";
import { createSignal } from "solid-js";

export default function CommandManyItems() {
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
            heading: "Navigation",
            options: [
              {
                value: "home",
                label: "Home",
                shortcut: "⌘H",
                icon: () => (
                  <IconPlaceholder
                    lucide="house"
                    tabler="home"
                    ph="house"
                    ri="home-4-line"
                    hugeicons="home-01"
                  />
                ),
              },
              {
                value: "inbox",
                label: "Inbox",
                shortcut: "⌘I",
                icon: () => (
                  <IconPlaceholder
                    lucide="inbox"
                    tabler="inbox"
                    ph="tray"
                    ri="inbox-line"
                    hugeicons="inbox"
                  />
                ),
              },
              {
                value: "documents",
                label: "Documents",
                shortcut: "⌘D",
                icon: () => (
                  <IconPlaceholder
                    lucide="file-text"
                    tabler="file-text"
                    ph="file-text"
                    ri="file-text-line"
                    hugeicons="file-02"
                  />
                ),
              },
              {
                value: "folders",
                label: "Folders",
                shortcut: "⌘F",
                icon: () => (
                  <IconPlaceholder
                    lucide="folder"
                    tabler="folder"
                    ph="folder"
                    ri="folder-line"
                    hugeicons="folder-01"
                  />
                ),
              },
            ],
          },
          {
            heading: "Actions",
            options: [
              {
                value: "new-file",
                label: "New File",
                shortcut: "⌘N",
                icon: () => (
                  <IconPlaceholder
                    lucide="plus"
                    tabler="plus"
                    ph="plus"
                    ri="add-line"
                    hugeicons="plus-sign"
                  />
                ),
              },
              {
                value: "new-folder",
                label: "New Folder",
                shortcut: "⇧⌘N",
                icon: () => (
                  <IconPlaceholder
                    lucide="folder-plus"
                    tabler="folder-plus"
                    ph="folder-plus"
                    ri="folder-add-line"
                    hugeicons="folder-add"
                  />
                ),
              },
              {
                value: "copy",
                label: "Copy",
                shortcut: "⌘C",
                icon: () => (
                  <IconPlaceholder
                    lucide="copy"
                    tabler="copy"
                    ph="copy"
                    ri="file-copy-line"
                    hugeicons="copy-01"
                  />
                ),
              },
              {
                value: "cut",
                label: "Cut",
                shortcut: "⌘X",
                icon: () => (
                  <IconPlaceholder
                    lucide="scissors"
                    tabler="scissors"
                    ph="scissors"
                    ri="scissors-line"
                    hugeicons="scissor-01"
                  />
                ),
              },
              {
                value: "paste",
                label: "Paste",
                shortcut: "⌘V",
                icon: () => (
                  <IconPlaceholder
                    lucide="clipboard-paste"
                    tabler="clipboard"
                    ph="clipboard-text"
                    ri="clipboard-line"
                    hugeicons="clipboard"
                  />
                ),
              },
              {
                value: "delete",
                label: "Delete",
                shortcut: "⌫",
                icon: () => (
                  <IconPlaceholder
                    lucide="trash"
                    tabler="trash"
                    ph="trash"
                    ri="delete-bin-line"
                    hugeicons="delete-02"
                  />
                ),
              },
            ],
          },
          {
            heading: "View",
            options: [
              {
                value: "grid-view",
                label: "Grid View",
                icon: () => (
                  <IconPlaceholder
                    lucide="layout-grid"
                    tabler="layout-grid"
                    ph="squares-four"
                    ri="layout-grid-line"
                    hugeicons="grid-view"
                  />
                ),
              },
              {
                value: "list-view",
                label: "List View",
                icon: () => (
                  <IconPlaceholder
                    lucide="list"
                    tabler="list"
                    ph="list"
                    ri="list-unordered"
                    hugeicons="left-to-right-list-bullet"
                  />
                ),
              },
              {
                value: "zoom-in",
                label: "Zoom In",
                shortcut: "⌘+",
                icon: () => (
                  <IconPlaceholder
                    lucide="zoom-in"
                    tabler="zoom-in"
                    ph="magnifying-glass-plus"
                    ri="zoom-in-line"
                    hugeicons="zoom-in-area"
                  />
                ),
              },
              {
                value: "zoom-out",
                label: "Zoom Out",
                shortcut: "⌘-",
                icon: () => (
                  <IconPlaceholder
                    lucide="zoom-out"
                    tabler="zoom-out"
                    ph="magnifying-glass-minus"
                    ri="zoom-out-line"
                    hugeicons="zoom-out-area"
                  />
                ),
              },
            ],
          },
          {
            heading: "Account",
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
              {
                value: "notifications",
                label: "Notifications",
                icon: () => (
                  <IconPlaceholder
                    lucide="bell"
                    tabler="bell"
                    ph="bell"
                    ri="notification-3-line"
                    hugeicons="notification-01"
                  />
                ),
              },
              {
                value: "help-support",
                label: "Help & Support",
                icon: () => (
                  <IconPlaceholder
                    lucide="circle-help"
                    tabler="help-circle"
                    ph="question"
                    ri="question-line"
                    hugeicons="help-circle"
                  />
                ),
              },
            ],
          },
          {
            heading: "Tools",
            options: [
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
                value: "image-editor",
                label: "Image Editor",
                icon: () => (
                  <IconPlaceholder
                    lucide="image"
                    tabler="photo"
                    ph="image"
                    ri="image-line"
                    hugeicons="image-01"
                  />
                ),
              },
              {
                value: "code-editor",
                label: "Code Editor",
                icon: () => (
                  <IconPlaceholder
                    lucide="code"
                    tabler="code"
                    ph="code"
                    ri="code-line"
                    hugeicons="source-code"
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
