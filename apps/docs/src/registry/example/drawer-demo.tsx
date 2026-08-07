import { createSignal, Index } from "solid-js";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
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

const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
];

export default function DrawerDemo() {
  const [goal, setGoal] = createSignal(350);

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal() + adjustment)));
  }

  return (
    <Drawer>
      <DrawerTrigger as={Button<"button">} variant="outline">
        Open Drawer
      </DrawerTrigger>
      <DrawerContent>
        <div class="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div class="p-4 pb-0">
            <div class="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                class="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(-10)}
                disabled={goal() <= 200}
              >
                <IconPlaceholder
                  lucide="minus"
                  tabler="minus"
                  ph="minus"
                  ri="subtract-line"
                  hugeicons="minus-sign"
                />
                <span class="sr-only">Decrease</span>
              </Button>
              <div class="flex-1 text-center">
                <div class="text-7xl font-bold tracking-tighter">{goal()}</div>
                <div class="text-[0.70rem] text-muted-foreground uppercase">
                  Calories/day
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                class="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(10)}
                disabled={goal() >= 400}
              >
                <IconPlaceholder
                  lucide="plus"
                  tabler="plus"
                  ph="plus"
                  ri="add-line"
                  hugeicons="plus-sign"
                />
                <span class="sr-only">Increase</span>
              </Button>
            </div>
            <div class="mt-3 flex h-[120px] items-end gap-1">
              <Index each={data}>
                {(item) => (
                  <div
                    class="flex-1"
                    style={{
                      "background-color": "var(--chart-1)",
                      height: `${(item().goal / 400) * 100}%`,
                    }}
                  />
                )}
              </Index>
            </div>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose as={Button<"button">} variant="outline">
              Cancel
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
