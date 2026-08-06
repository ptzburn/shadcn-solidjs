import { IconArrowUp } from "~/components/icons.tsx";

import { Button } from "~/registry/ui/button.tsx";

export default function ButtonRounded() {
  return (
    <div class="flex gap-2">
      <Button class="rounded-full">Get Started</Button>
      <Button variant="outline" size="icon" class="rounded-full">
        <IconArrowUp />
      </Button>
    </div>
  );
}
