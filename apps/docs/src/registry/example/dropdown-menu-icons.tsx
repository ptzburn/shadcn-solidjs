import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";

export default function DropdownMenuIcons() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger as={Button<"button">} variant="outline">
        Open
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <IconPlaceholder
            lucide="user"
            tabler="user"
            ph="user"
            ri="user-line"
            hugeicons="user"
          />
          Profile
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
        <DropdownMenuItem>
          <IconPlaceholder
            lucide="settings"
            tabler="settings"
            ph="gear"
            ri="settings-3-line"
            hugeicons="settings-01"
          />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <IconPlaceholder
            lucide="log-out"
            tabler="logout"
            ph="sign-out"
            ri="logout-box-r-line"
            hugeicons="logout-01"
          />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
