import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "~/registry/ui/avatar.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";

export default function DropdownMenuAvatar() {
  return (
    <DropdownMenu placement="bottom-end">
      <DropdownMenuTrigger
        as={Button<"button">}
        variant="ghost"
        size="icon"
        class="rounded-full"
      >
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="badge-check"
              tabler="rosette-discount-check"
              ph="seal-check"
              ri="verified-badge-line"
              hugeicons="checkmark-badge-02"
            />
            Account
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
              lucide="bell"
              tabler="bell"
              ph="bell"
              ri="notification-3-line"
              hugeicons="notification-01"
            />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <IconPlaceholder
            lucide="log-out"
            tabler="logout"
            ph="sign-out"
            ri="logout-box-r-line"
            hugeicons="logout-01"
          />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
