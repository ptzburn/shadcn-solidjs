import { IconArrowUp } from "~/components/icons.tsx";

import { Button } from "~/registry/ui/button.tsx";

export default function ButtonRounded() {
  return (
    <div class="flex flex-col gap-8">
      <Button variant="outline" size="icon" class="rounded-full">
        <IconArrowUp />
      </Button>
    </div>
  );
}
