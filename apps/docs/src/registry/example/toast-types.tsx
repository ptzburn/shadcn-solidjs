import { Button } from "~/registry/ui/button.tsx";
import { toast } from "~/registry/ui/toast.tsx";

export default function ToastTypes() {
  return (
    <div class="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() => toast.add({ description: "Event has been created." })}
      >
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: "success",
            description: "Event has been created.",
          })}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: "info",
            description: "Arrive 10 minutes before the event.",
          })}
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: "warning",
            description: "The event is at full capacity.",
          })}
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: "error",
            description: "The event could not be created.",
          })}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: "loading",
            description: "Creating the event…",
          })}
      >
        Loading
      </Button>
    </div>
  );
}
