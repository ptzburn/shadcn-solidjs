import { createSignal } from "solid-js";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";

export default function DropdownMenuCheckboxesIcons() {
  const [notifications, setNotifications] = createSignal({
    email: true,
    sms: false,
    push: true,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger as={Button<"button">} variant="outline">
        Notifications
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Notification Preferences</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={notifications().email}
            onChange={(checked) =>
              setNotifications({ ...notifications(), email: checked })}
          >
            <IconPlaceholder
              lucide="mail"
              tabler="mail"
              ph="envelope"
              ri="mail-line"
              hugeicons="mail-01"
            />
            Email notifications
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={notifications().sms}
            onChange={(checked) =>
              setNotifications({ ...notifications(), sms: checked })}
          >
            <IconPlaceholder
              lucide="message-square"
              tabler="message"
              ph="chat"
              ri="chat-1-line"
              hugeicons="message-01"
            />
            SMS notifications
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={notifications().push}
            onChange={(checked) =>
              setNotifications({ ...notifications(), push: checked })}
          >
            <IconPlaceholder
              lucide="bell"
              tabler="bell"
              ph="bell"
              ri="notification-3-line"
              hugeicons="notification-01"
            />
            Push notifications
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
