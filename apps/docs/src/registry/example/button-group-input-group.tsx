import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

import { ButtonGroup } from "~/registry/ui/button-group.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/registry/ui/input-group.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/registry/ui/tooltip.tsx";
import { createSignal } from "solid-js";

export default function ButtonGroupInputGroup() {
  const [voiceEnabled, setVoiceEnabled] = createSignal(false);

  return (
    <ButtonGroup class="[--radius:9999rem]">
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
          <InputGroupInput
            placeholder={voiceEnabled()
              ? "Record and send audio..."
              : "Send a message..."}
            disabled={voiceEnabled()}
          />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger
                as={InputGroupButton}
                onClick={() => setVoiceEnabled(!voiceEnabled())}
                size="icon-xs"
                data-active={voiceEnabled()}
                class="dark:data-[active=true]:bg-orange-800 dark:data-[active=true]:text-orange-100 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-700"
                aria-pressed={voiceEnabled()}
              >
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
          </InputGroupAddon>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  );
}
