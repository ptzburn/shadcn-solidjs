import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/registry/ui/empty.tsx";

export default function EmptyBackground() {
  return (
    <Empty class="h-full bg-muted/30">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconPlaceholder
            lucide="bell"
            tabler="bell"
            ph="bell"
            ri="notification-3-line"
            hugeicons="notification-01"
          />
        </EmptyMedia>
        <EmptyTitle>No Notifications</EmptyTitle>
        <EmptyDescription class="max-w-xs text-pretty">
          You&apos;re all caught up. New notifications will appear here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">
          <IconPlaceholder
            lucide="refresh-ccw"
            tabler="refresh"
            ph="arrows-clockwise"
            ri="refresh-line"
            hugeicons="refresh"
          />
          Refresh
        </Button>
      </EmptyContent>
    </Empty>
  );
}
