import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "~/registry/ui/avatar.tsx";

export default function AvatarBadgeIconExample() {
  return (
    <Avatar class="grayscale">
      <AvatarImage src="https://github.com/pranathip.png" alt="@pranathip" />
      <AvatarFallback>PP</AvatarFallback>
      <AvatarBadge>
        <IconPlaceholder
          lucide="plus"
          tabler="plus"
          ph="plus"
          ri="add-line"
          hugeicons="plus-sign"
        />
      </AvatarBadge>
    </Avatar>
  );
}
