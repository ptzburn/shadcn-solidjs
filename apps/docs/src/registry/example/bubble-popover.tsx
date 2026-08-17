import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import {
  Bubble,
  BubbleContent,
  BubbleReactions,
} from "~/registry/ui/bubble.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "~/registry/ui/popover.tsx";

export default function BubblePopoverDemo() {
  return (
    <div class="flex w-full max-w-sm flex-col gap-4 py-12">
      <Bubble align="end">
        <BubbleContent>Run the build script.</BubbleContent>
      </Bubble>
      <Bubble variant="destructive">
        <BubbleContent>Failed to run the command.</BubbleContent>
        <BubbleReactions>
          <Popover>
            <PopoverTrigger
              as={Button<"button">}
              variant="ghost"
              size="icon-xs"
              aria-label="Show error details"
              class="aria-expanded:text-destructive"
            >
              <IconPlaceholder
                lucide="info"
                tabler="info-circle"
                ph="info"
                ri="information-line"
                hugeicons="information-circle"
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle class="text-sm">
                  Command failed with exit code 1
                </PopoverTitle>
                <PopoverDescription class="text-sm">
                  ENOENT: no such file or directory, open pnpm-lock.yaml
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </BubbleReactions>
      </Bubble>
    </div>
  );
}
