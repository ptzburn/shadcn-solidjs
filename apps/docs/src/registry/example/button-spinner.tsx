import { Button } from "~/registry/ui/button.tsx";
import { Spinner } from "~/registry/ui/spinner.tsx";

export default function ButtonSpinner() {
  return (
    <div class="flex gap-2">
      <Button variant="outline" disabled>
        <Spinner data-icon="inline-start" />
        Generating
      </Button>
      <Button variant="secondary" disabled>
        Downloading
        <Spinner data-icon="inline-start" />
      </Button>
    </div>
  );
}
