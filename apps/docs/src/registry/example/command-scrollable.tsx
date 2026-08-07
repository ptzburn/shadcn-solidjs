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
  CommandSeparator,
  CommandShortcut,
} from "~/registry/ui/command.tsx";

export default function CommandManyItems() {
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
            <CommandGroup heading="Navigation">
              <CommandItem>
                <IconPlaceholder
                  lucide="house"
                  tabler="home"
                  ph="house"
                  ri="home-4-line"
                  hugeicons="home-01"
                />
                <span>Home</span>
                <CommandShortcut>⌘H</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="inbox"
                  tabler="inbox"
                  ph="tray"
                  ri="inbox-line"
                  hugeicons="inbox"
                />
                <span>Inbox</span>
                <CommandShortcut>⌘I</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="file-text"
                  tabler="file-text"
                  ph="file-text"
                  ri="file-text-line"
                  hugeicons="file-02"
                />
                <span>Documents</span>
                <CommandShortcut>⌘D</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="folder"
                  tabler="folder"
                  ph="folder"
                  ri="folder-line"
                  hugeicons="folder-01"
                />
                <span>Folders</span>
                <CommandShortcut>⌘F</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem>
                <IconPlaceholder
                  lucide="plus"
                  tabler="plus"
                  ph="plus"
                  ri="add-line"
                  hugeicons="plus-sign"
                />
                <span>New File</span>
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="folder-plus"
                  tabler="folder-plus"
                  ph="folder-plus"
                  ri="folder-add-line"
                  hugeicons="folder-add"
                />
                <span>New Folder</span>
                <CommandShortcut>⇧⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="copy"
                  tabler="copy"
                  ph="copy"
                  ri="file-copy-line"
                  hugeicons="copy-01"
                />
                <span>Copy</span>
                <CommandShortcut>⌘C</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="scissors"
                  tabler="scissors"
                  ph="scissors"
                  ri="scissors-line"
                  hugeicons="scissor-01"
                />
                <span>Cut</span>
                <CommandShortcut>⌘X</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="clipboard-paste"
                  tabler="clipboard"
                  ph="clipboard-text"
                  ri="clipboard-line"
                  hugeicons="clipboard"
                />
                <span>Paste</span>
                <CommandShortcut>⌘V</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="trash"
                  tabler="trash"
                  ph="trash"
                  ri="delete-bin-line"
                  hugeicons="delete-02"
                />
                <span>Delete</span>
                <CommandShortcut>⌫</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="View">
              <CommandItem>
                <IconPlaceholder
                  lucide="layout-grid"
                  tabler="layout-grid"
                  ph="squares-four"
                  ri="layout-grid-line"
                  hugeicons="grid-view"
                />
                <span>Grid View</span>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="list"
                  tabler="list"
                  ph="list"
                  ri="list-unordered"
                  hugeicons="left-to-right-list-bullet"
                />
                <span>List View</span>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="zoom-in"
                  tabler="zoom-in"
                  ph="magnifying-glass-plus"
                  ri="zoom-in-line"
                  hugeicons="zoom-in-area"
                />
                <span>Zoom In</span>
                <CommandShortcut>⌘+</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="zoom-out"
                  tabler="zoom-out"
                  ph="magnifying-glass-minus"
                  ri="zoom-out-line"
                  hugeicons="zoom-out-area"
                />
                <span>Zoom Out</span>
                <CommandShortcut>⌘-</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Account">
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
              <CommandItem>
                <IconPlaceholder
                  lucide="bell"
                  tabler="bell"
                  ph="bell"
                  ri="notification-3-line"
                  hugeicons="notification-01"
                />
                <span>Notifications</span>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="circle-help"
                  tabler="help-circle"
                  ph="question"
                  ri="question-line"
                  hugeicons="help-circle"
                />
                <span>Help & Support</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Tools">
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
                  lucide="image"
                  tabler="photo"
                  ph="image"
                  ri="image-line"
                  hugeicons="image-01"
                />
                <span>Image Editor</span>
              </CommandItem>
              <CommandItem>
                <IconPlaceholder
                  lucide="code"
                  tabler="code"
                  ph="code"
                  ri="code-line"
                  hugeicons="source-code"
                />
                <span>Code Editor</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
