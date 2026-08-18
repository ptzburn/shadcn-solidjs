import { Button } from "~/registry/ui/button.tsx";

import { Card, CardContent } from "~/registry/ui/card.tsx";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/registry/ui/empty.tsx";
import IconAdd01 from "~icons/hugeicons/add-01";

export function EmptyDistributeTrack() {
  return (
    <Card>
      <CardContent>
        <Empty class="p-4">
          <EmptyMedia variant="icon">
            <IconAdd01 />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Distribute Track</EmptyTitle>
            <EmptyDescription>
              Upload your first master to start reaching listeners on Spotify,
              Apple Music, and more.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>Create Release</Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}
