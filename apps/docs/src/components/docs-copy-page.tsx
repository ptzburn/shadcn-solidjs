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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";
import { Separator } from "~/registry/ui/separator.tsx";

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
    <div class="group/buttons relative flex rounded-lg bg-secondary *:[[data-slot=button]]:focus-visible:relative *:[[data-slot=button]]:focus-visible:z-10">
      <Button
        variant="secondary"
        size="sm"
        class="h-8 shadow-none md:h-7 md:text-[0.8rem]"
        onClick={copyPage}
      >
        <Show when={isCopied()} fallback={<IconCopy />}>
          <IconCheck />
        </Show>
        Copy Page
      </Button>
      <DropdownMenu placement="bottom-end">
        <DropdownMenuTrigger
          as={Button}
          variant="secondary"
          size="sm"
          class="peer -ml-0.5 size-8 shadow-none md:size-7 md:text-[0.8rem]"
        >
          <IconChevronDown />
          <span class="sr-only">More options</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-auto animate-none! rounded-lg shadow-none">
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
      <Separator
        orientation="vertical"
        class="absolute top-1 right-8 z-0 h-6! bg-foreground/5! peer-focus-visible:opacity-0 sm:right-7 sm:h-5!"
      />
    </div>
  );
}
