import { Button } from "~/registry/ui/button.tsx";
import { CommandDialog } from "~/registry/ui/command.tsx";
import { createSignal } from "solid-js";

export default function CommandBasic() {
  const [open, setOpen] = createSignal(false);

  return (
    <div class="flex flex-col gap-4">
      <Button onClick={() => setOpen(true)} variant="outline" class="w-fit">
        Open Menu
      </Button>
      <CommandDialog
        open={open()}
        onOpenChange={setOpen}
        options={[
          {
            heading: "Suggestions",
            options: [
              { value: "calendar", label: "Calendar" },
              { value: "search-emoji", label: "Search Emoji" },
              { value: "calculator", label: "Calculator" },
            ],
          },
        ]}
      />
    </div>
  );
}
