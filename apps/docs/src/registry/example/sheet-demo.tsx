import { For } from "solid-js";

import { Button } from "~/registry/ui/button.tsx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/registry/ui/sheet.tsx";
import { Input } from "~/registry/ui/input.tsx";
import { Label } from "~/registry/ui/label.tsx";

const SHEET_POSITIONS = ["top", "right", "bottom", "left"] as const;

export default function SheetDemo() {
  return (
    <div class="grid grid-cols-2 gap-2">
      <For each={SHEET_POSITIONS}>
        {(position) => (
          <Sheet>
            <SheetTrigger as={Button<"button">} variant="outline">
              {position}
            </SheetTrigger>
            <SheetContent side={position}>
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </SheetDescription>
              </SheetHeader>
              <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for={`name-${position}`} class="justify-end">
                    Name
                  </Label>
                  <Input
                    id={`name-${position}`}
                    value="Pedro Duarte"
                    class="col-span-3"
                  />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for={`username-${position}`} class="justify-end">
                    Username
                  </Label>
                  <Input
                    id={`username-${position}`}
                    value="@peduarte"
                    class="col-span-3"
                  />
                </div>
              </div>
              <SheetFooter>
                <Button type="submit">Save changes</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        )}
      </For>
    </div>
  );
}
