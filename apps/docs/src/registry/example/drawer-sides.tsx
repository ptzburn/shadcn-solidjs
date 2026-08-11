import { Button } from "~/registry/ui/button.tsx";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/registry/ui/drawer.tsx";
import { For, Index } from "solid-js";

const DRAWER_SIDES = ["top", "right", "bottom", "left"] as const;

export default function DrawerWithSides() {
  return (
    <div class="flex flex-wrap gap-2">
      <For each={DRAWER_SIDES}>
        {(side) => (
          <Drawer side={side === "bottom" ? undefined : side}>
            <DrawerTrigger
              as={Button<"button">}
              variant="outline"
              class="capitalize"
            >
              {side}
            </DrawerTrigger>
            <DrawerContent class="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]">
              <DrawerHeader>
                <DrawerTitle>Move Goal</DrawerTitle>
                <DrawerDescription>
                  Set your daily activity goal.
                </DrawerDescription>
              </DrawerHeader>
              <div class="no-scrollbar overflow-y-auto px-4">
                <Index each={Array.from({ length: 10 })}>
                  {() => (
                    <p class="mb-4 leading-normal">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
                    </p>
                  )}
                </Index>
              </div>
              <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose as={Button<"button">} variant="outline">
                  Cancel
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </For>
    </div>
  );
}
