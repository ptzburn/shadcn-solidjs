import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "~/registry/ui/avatar.tsx";

export default function AvatarGroupCountIconExample() {
  return (
    <AvatarGroup class="grayscale">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
        <AvatarFallback>LR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src="https://github.com/evilrabbit.png"
          alt="@evilrabbit"
        />
        <AvatarFallback>ER</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>
        <IconPlaceholder
          lucide="plus"
          tabler="plus"
          ph="plus"
          ri="add-line"
          hugeicons="plus-sign"
        />
      </AvatarGroupCount>
    </AvatarGroup>
  );
}
