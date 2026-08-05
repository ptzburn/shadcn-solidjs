import { Button } from "~/registry/ui/button.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/registry/ui/tooltip.tsx";

export default function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger as={Button<"button">} variant="outline">
        Trigger
      </TooltipTrigger>
      <TooltipContent>
        <p>Tooltip content</p>
      </TooltipContent>
    </Tooltip>
  );
}
