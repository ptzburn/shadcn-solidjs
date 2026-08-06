import { Badge } from "~/registry/ui/badge.tsx";
import { Spinner } from "~/registry/ui/spinner.tsx";

export default function BadgeWithSpinner() {
  return (
    <div class="flex flex-wrap gap-2">
      <Badge variant="destructive">
        <Spinner data-icon="inline-start" />
        Deleting
      </Badge>
      <Badge variant="secondary">
        Generating
        <Spinner data-icon="inline-end" />
      </Badge>
    </div>
  );
}
