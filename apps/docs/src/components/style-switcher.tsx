import { IconCheck } from "~/components/icons.tsx";

import { useStyle } from "~/lib/style-context.tsx";
import { styles } from "~/registry/styles.ts";
import { Button } from "~/registry/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";
import { For, Show } from "solid-js";

/**
 * Switches the style the whole docs site renders in.
 *
 * Our chrome is built on the same registry as the components it
 * documents, so a style applies site-wide rather than only to previews.
 * That is the point: it shows a style on a real interface instead of on
 * isolated examples.
 */
export function StyleSwitcher(props: { class?: string }) {
  const { style, setStyle } = useStyle();
  const active = () => styles.find((entry) => entry.name === style());

  return (
    <DropdownMenu placement="bottom-end">
      <DropdownMenuTrigger
        as={Button}
        variant="ghost"
        size="sm"
        class={props.class}
      >
        {active()?.title ?? "Style"}
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56">
        <For each={styles}>
          {(entry) => (
            <DropdownMenuItem
              onSelect={() => setStyle(entry.name)}
              class="flex items-start gap-2"
            >
              <div class="flex flex-1 flex-col">
                <span class="font-medium">{entry.title}</span>
                <span class="text-muted-foreground text-xs">
                  {entry.description}
                </span>
              </div>
              <Show when={style() === entry.name}>
                <IconCheck class="mt-0.5 size-4 shrink-0" />
              </Show>
            </DropdownMenuItem>
          )}
        </For>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
