import { Badge } from "~/registry/ui/badge.tsx";
import { Spinner } from "~/registry/ui/spinner.tsx";

export default function SpinnerBadge() {
  return (
    <div class="[--radius:1.2rem] flex items-center gap-4">
      <Badge>
        <Spinner data-icon="inline-start" />
        Syncing
      </Badge>
      <Badge variant="secondary">
        <Spinner data-icon="inline-start" />
        Updating
      </Badge>
      <Badge variant="outline">
        <Spinner data-icon="inline-start" />
        Processing
      </Badge>
    </div>
  );
}
