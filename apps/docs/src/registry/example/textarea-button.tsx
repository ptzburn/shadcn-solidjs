import { Button } from "~/registry/ui/button.tsx";
import { Textarea } from "~/registry/ui/textarea.tsx";

export default function TextareaButton() {
  return (
    <div class="grid w-full gap-2">
      <Textarea placeholder="Type your message here." />
      <Button>Send message</Button>
    </div>
  );
}
