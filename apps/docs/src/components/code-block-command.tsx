import type { Component } from "solid-js";
import { createSignal, For, Show } from "solid-js";

import { IconCheck, IconCopy, IconTerminal } from "~/components/icons.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/registry/ui/tabs.tsx";

interface CodeBlockCommandProps {
  npm: string;
}

/**
 * Port of the upstream shadcn command block. Only npm is offered for
 * now — add the other package managers to `tabs` once the CLI story
 * supports them, plus a persisted selection like upstream's useConfig.
 *
 * font-mono on the root stands in for the `pre` wrapper the upstream
 * block renders inside, which its tab labels inherit their font from.
 */
const CodeBlockCommand: Component<CodeBlockCommandProps> = (props) => {
  const [hasCopied, setHasCopied] = createSignal(false);
  const tabs = () => ({ npm: props.npm });

  const copyCommand = () => {
    navigator.clipboard?.writeText(props.npm);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div
      data-not-typeset
      class="relative -mx-1 mt-6 overflow-hidden rounded-2xl bg-code font-mono text-sm text-code-foreground md:-mx-1"
    >
      <Tabs value="npm" class="gap-0">
        <div class="flex items-center gap-2 border-b border-border/50 px-3 py-1">
          <div class="flex size-4 items-center justify-center rounded-[1px] bg-foreground opacity-70">
            <IconTerminal class="size-3 text-code" />
          </div>
          <TabsList class="rounded-none bg-transparent p-0">
            <For each={Object.keys(tabs())}>
              {(key) => (
                <TabsTrigger
                  value={key}
                  class="h-7 border border-transparent pt-0.5 shadow-none! data-[selected]:border-input data-[selected]:bg-background!"
                >
                  {key}
                </TabsTrigger>
              )}
            </For>
          </TabsList>
        </div>
        <div class="no-scrollbar overflow-x-auto">
          <For each={Object.entries(tabs())}>
            {([key, value]) => (
              <TabsContent value={key} class="mt-0 px-4 py-3.5">
                <pre>
                  <code
                    class="relative font-mono text-sm leading-none"
                    data-language="bash"
                  >
                    {value}
                  </code>
                </pre>
              </TabsContent>
            )}
          </For>
        </div>
      </Tabs>
      <Button
        data-slot="copy-button"
        size="icon"
        variant="ghost"
        class="absolute top-2 right-2 z-10 size-7 opacity-70 hover:opacity-100 focus-visible:opacity-100"
        onClick={copyCommand}
      >
        <span class="sr-only">Copy</span>
        <Show when={hasCopied()} fallback={<IconCopy class="size-4" />}>
          <IconCheck class="size-4" />
        </Show>
      </Button>
    </div>
  );
};

export { CodeBlockCommand };
