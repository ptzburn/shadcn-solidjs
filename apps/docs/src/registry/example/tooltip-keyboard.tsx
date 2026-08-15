import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { Kbd } from "~/registry/ui/kbd.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/registry/ui/tooltip.tsx";

export default function TooltipKeyboard() {
  return (
    <Tooltip>
      <TooltipTrigger as={Button<"button">} variant="outline" size="icon-sm">
        <IconPlaceholder
          lucide="save"
          tabler="device-floppy"
          ph="floppy-disk"
          ri="save-line"
          hugeicons="floppy-disk"
        />
      </TooltipTrigger>
      <TooltipContent>
        Save Changes <Kbd>S</Kbd>
      </TooltipContent>
    </Tooltip>
  );
}
