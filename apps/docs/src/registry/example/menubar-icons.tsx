import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "~/registry/ui/menubar.tsx";

export default function MenubarIcons() {
  return (
    <Menubar class="w-72">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <IconPlaceholder
              lucide="file"
              tabler="file"
              ph="file"
              ri="file-line"
              hugeicons="file-01"
            />
            New File <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <IconPlaceholder
              lucide="folder"
              tabler="folder"
              ph="folder"
              ri="folder-line"
              hugeicons="folder-01"
            />
            Open Folder
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <IconPlaceholder
              lucide="save"
              tabler="device-floppy"
              ph="floppy-disk"
              ri="save-line"
              hugeicons="floppy-disk"
            />
            Save <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>More</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              <IconPlaceholder
                lucide="settings"
                tabler="settings"
                ph="gear"
                ri="settings-3-line"
                hugeicons="settings-01"
              />
              Settings
            </MenubarItem>
            <MenubarItem>
              <IconPlaceholder
                lucide="circle-help"
                tabler="help-circle"
                ph="question"
                ri="question-line"
                hugeicons="help-circle"
              />
              Help
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem variant="destructive">
              <IconPlaceholder
                lucide="trash"
                tabler="trash"
                ph="trash"
                ri="delete-bin-line"
                hugeicons="delete-02"
              />
              Delete
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
