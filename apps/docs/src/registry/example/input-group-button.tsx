import { createSignal, Show } from "solid-js";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/registry/ui/input-group.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/registry/ui/popover.tsx";

export default function InputGroupButtonExample() {
  const [isCopied, setIsCopied] = createSignal(false);
  const [isFavorite, setIsFavorite] = createSignal(false);

  const copyToClipboard = (value: string) => {
    navigator.clipboard?.writeText(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div class="grid w-full max-w-sm gap-6">
      <InputGroup>
        <InputGroupInput placeholder="https://x.com/shadcn" readOnly />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Copy"
            title="Copy"
            size="icon-xs"
            onClick={() => {
              copyToClipboard("https://x.com/shadcn");
            }}
          >
            <Show
              when={isCopied()}
              fallback={
                <IconPlaceholder
                  lucide="copy"
                  tabler="copy"
                  ph="copy"
                  ri="file-copy-line"
                  hugeicons="copy-01"
                />
              }
            >
              <IconPlaceholder
                lucide="check"
                tabler="check"
                ph="check"
                ri="check-line"
                hugeicons="tick-02"
              />
            </Show>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup class="[--radius:9999px]">
        <Popover placement="bottom-start">
          <InputGroupAddon>
            <PopoverTrigger
              as={InputGroupButton}
              variant="secondary"
              size="icon-xs"
            >
              <IconPlaceholder
                lucide="info"
                tabler="info-circle"
                ph="info"
                ri="information-line"
                hugeicons="information-circle"
              />
            </PopoverTrigger>
          </InputGroupAddon>
          <PopoverContent class="flex flex-col gap-1 rounded-xl text-sm">
            <p class="font-medium">Your connection is not secure.</p>
            <p>You should not enter any sensitive information on this site.</p>
          </PopoverContent>
        </Popover>
        <InputGroupAddon class="pl-1.5 text-muted-foreground">
          https://
        </InputGroupAddon>
        <InputGroupInput id="input-secure-19" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={() => setIsFavorite(!isFavorite())}
            size="icon-xs"
          >
            <IconPlaceholder
              lucide="star"
              tabler="star"
              ph="star"
              ri="star-line"
              hugeicons="star"
              data-favorite={isFavorite()}
              // Registry icons carry `fill`/`stroke` on their inner paths, not
              // on the root `svg` the way lucide-react does, so upstream's
              // `fill-*`/`stroke-*` classes have to reach one level deeper.
              class="data-[favorite=true]:*:fill-blue-600 data-[favorite=true]:*:stroke-blue-600"
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Type to search..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="secondary">Search</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
