import { For } from "solid-js";

import { Button } from "~/registry/ui/button.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/registry/ui/tooltip.tsx";

const TOOLTIP_SIDES = ["left", "top", "bottom", "right"] as const;

export default function TooltipSides() {
  return (
    <div class="flex flex-wrap gap-2">
      <For each={TOOLTIP_SIDES}>
        {(side) => (
          <Tooltip placement={side}>
            <TooltipTrigger
              as={Button<"button">}
              variant="outline"
              class="w-fit capitalize"
            >
              {side}
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>
        )}
      </For>
    </div>
  );
}
