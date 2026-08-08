import { createSignal, Show } from "solid-js";
import { useLocation } from "@solidjs/router";

import {
  IconCheck,
  IconChevronDown,
  IconCopy,
  IconMarkdown,
} from "~/components/icons.tsx";
import { loadDocMarkdown } from "~/lib/docs-raw.ts";
import { Button } from "~/registry/ui/button.tsx";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "~/registry/ui/button-group.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";

export function DocsCopyPage() {
  const location = useLocation();
  const [isCopied, setCopied] = createSignal(false);
  const markdownUrl = () => `${location.pathname}.md`;

  const copyPage = async () => {
    const content = await loadDocMarkdown(location.pathname);
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    // ButtonGroup already knows how each style joins adjacent buttons --
    // flat inner edges, the style's own radius on the outer ones -- and
    // its separator stretches to the button height, so none of that has
    // to be hardcoded here.
    <ButtonGroup>
      <Button
        variant="secondary"
        size="sm"
        class="shadow-none hover:bg-secondary/80 max-md:h-8"
        onClick={copyPage}
      >
        <Show when={isCopied()} fallback={<IconCopy />}>
          <IconCheck />
        </Show>
        Copy Page
      </Button>
      <ButtonGroupSeparator class="bg-foreground/5!" />
      <DropdownMenu placement="bottom-end">
        <DropdownMenuTrigger
          as={Button}
          variant="secondary"
          size="icon-sm"
          class="shadow-none hover:bg-secondary/80 max-md:size-8"
        >
          <IconChevronDown />
          <span class="sr-only">More options</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-auto animate-none! shadow-none">
          <DropdownMenuItem
            as="a"
            href={markdownUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconMarkdown />
            View as Markdown
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
