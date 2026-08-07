import { createSignal } from "solid-js";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";

export default function DropdownMenuComplex() {
  const [notifications, setNotifications] = createSignal({
    email: true,
    sms: false,
    push: true,
  });
  const [theme, setTheme] = createSignal("light");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger as={Button<"button">} variant="outline">
        Complex Menu
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>File</DropdownMenuLabel>
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="file"
              tabler="file"
              ph="file"
              ri="file-line"
              hugeicons="file-01"
            />
            New File
            <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="folder"
              tabler="folder"
              ph="folder"
              ri="folder-line"
              hugeicons="folder-01"
            />
            New Folder
            <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <IconPlaceholder
                lucide="folder-open"
                tabler="folder-open"
                ph="folder-open"
                ri="folder-open-line"
                hugeicons="folder-open"
              />
              Open Recent
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="file-code"
                    tabler="file-code"
                    ph="file-code"
                    ri="file-code-line"
                    hugeicons="file-script"
                  />
                  Project Alpha
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="file-code"
                    tabler="file-code"
                    ph="file-code"
                    ri="file-code-line"
                    hugeicons="file-script"
                  />
                  Project Beta
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <IconPlaceholder
                      lucide="ellipsis"
                      tabler="dots"
                      ph="dots-three"
                      ri="more-line"
                      hugeicons="more-horizontal"
                    />
                    More Projects
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="file-code"
                        tabler="file-code"
                        ph="file-code"
                        ri="file-code-line"
                        hugeicons="file-script"
                      />
                      Project Gamma
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="file-code"
                        tabler="file-code"
                        ph="file-code"
                        ri="file-code-line"
                        hugeicons="file-script"
                      />
                      Project Delta
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="folder-search"
                    tabler="folder-search"
                    ph="magnifying-glass"
                    ri="search-line"
                    hugeicons="folder-search"
                  />
                  Browse...
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="save"
              tabler="device-floppy"
              ph="floppy-disk"
              ri="save-line"
              hugeicons="floppy-disk"
            />
            Save
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="download"
              tabler="download"
              ph="download-simple"
              ri="download-line"
              hugeicons="download-01"
            />
            Export
            <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>View</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={notifications().email}
            onChange={(checked) =>
              setNotifications({ ...notifications(), email: checked })}
          >
            <IconPlaceholder
              lucide="eye"
              tabler="eye"
              ph="eye"
              ri="eye-line"
              hugeicons="view"
            />
            Show Sidebar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={notifications().sms}
            onChange={(checked) =>
              setNotifications({ ...notifications(), sms: checked })}
          >
            <IconPlaceholder
              lucide="layout"
              tabler="layout"
              ph="layout"
              ri="layout-line"
              hugeicons="layout-01"
            />
            Show Status Bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <IconPlaceholder
                lucide="palette"
                tabler="palette"
                ph="palette"
                ri="palette-line"
                hugeicons="paint-board"
              />
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={theme()} onChange={setTheme}>
                  <DropdownMenuRadioItem value="light">
                    <IconPlaceholder
                      lucide="sun"
                      tabler="sun"
                      ph="sun"
                      ri="sun-line"
                      hugeicons="sun-03"
                    />
                    Light
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    <IconPlaceholder
                      lucide="moon"
                      tabler="moon"
                      ph="moon"
                      ri="moon-line"
                      hugeicons="moon-02"
                    />
                    Dark
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">
                    <IconPlaceholder
                      lucide="monitor"
                      tabler="device-desktop"
                      ph="monitor"
                      ri="computer-line"
                      hugeicons="computer"
                    />
                    System
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="user"
              tabler="user"
              ph="user"
              ri="user-line"
              hugeicons="user"
            />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="credit-card"
              tabler="credit-card"
              ph="credit-card"
              ri="bank-card-line"
              hugeicons="credit-card"
            />
            Billing
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <IconPlaceholder
                lucide="settings"
                tabler="settings"
                ph="gear"
                ri="settings-3-line"
                hugeicons="settings-01"
              />
              Settings
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Preferences</DropdownMenuLabel>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="keyboard"
                    tabler="keyboard"
                    ph="keyboard"
                    ri="keyboard-line"
                    hugeicons="keyboard"
                  />
                  Keyboard Shortcuts
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="languages"
                    tabler="language"
                    ph="translate"
                    ri="translate-2"
                    hugeicons="translate"
                  />
                  Language
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <IconPlaceholder
                      lucide="bell"
                      tabler="bell"
                      ph="bell"
                      ri="notification-3-line"
                      hugeicons="notification-01"
                    />
                    Notifications
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Notification Types</DropdownMenuLabel>
                      <DropdownMenuCheckboxItem
                        checked={notifications().push}
                        onChange={(checked) =>
                          setNotifications({
                            ...notifications(),
                            push: checked,
                          })}
                      >
                        <IconPlaceholder
                          lucide="bell"
                          tabler="bell"
                          ph="bell"
                          ri="notification-3-line"
                          hugeicons="notification-01"
                        />
                        Push Notifications
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={notifications().email}
                        onChange={(checked) =>
                          setNotifications({
                            ...notifications(),
                            email: checked,
                          })}
                      >
                        <IconPlaceholder
                          lucide="mail"
                          tabler="mail"
                          ph="envelope"
                          ri="mail-line"
                          hugeicons="mail-01"
                        />
                        Email Notifications
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="shield"
                    tabler="shield"
                    ph="shield"
                    ri="shield-line"
                    hugeicons="shield-01"
                  />
                  Privacy & Security
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="circle-help"
              tabler="help-circle"
              ph="question"
              ri="question-line"
              hugeicons="help-circle"
            />
            Help & Support
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="file-text"
              tabler="file-text"
              ph="file-text"
              ri="file-text-line"
              hugeicons="file-02"
            />
            Documentation
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">
            <IconPlaceholder
              lucide="log-out"
              tabler="logout"
              ph="sign-out"
              ri="logout-box-r-line"
              hugeicons="logout-01"
            />
            Sign Out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
