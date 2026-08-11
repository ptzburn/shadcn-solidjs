import { Button } from "~/registry/ui/button.tsx";

import { toast } from "solid-sonner";

export default function SonnerDescription() {
  return (
    <Button
      onClick={() =>
        toast("Event has been created", {
          description: "Monday, January 3rd at 6:00pm",
        })}
      variant="outline"
      class="w-fit"
    >
      Show Toast
    </Button>
  );
}
