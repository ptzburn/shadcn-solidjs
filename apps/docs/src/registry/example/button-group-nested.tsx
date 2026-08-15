import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { ButtonGroup } from "~/registry/ui/button-group.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/registry/ui/input-group.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/registry/ui/tooltip.tsx";

export default function ButtonGroupNested() {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="plus"
            tabler="plus"
            ph="plus"
            ri="add-line"
            hugeicons="plus-sign"
          />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <InputGroup>
          <InputGroupInput placeholder="Send a message..." />
          <Tooltip>
            <TooltipTrigger as={InputGroupAddon} align="inline-end">
              <IconPlaceholder
                lucide="audio-lines"
                tabler="wave-sine"
                ph="waveform"
                ri="pulse-line"
                hugeicons="audio-wave-01"
              />
            </TooltipTrigger>
            <TooltipContent>Voice Mode</TooltipContent>
          </Tooltip>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  );
}
