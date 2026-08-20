import { IconCheck, IconSliders } from "~/components/icons.tsx";

import { useBaseColor } from "~/lib/base-color-context.tsx";
import { baseColors } from "~/lib/base-colors.ts";
import { useStyle } from "~/lib/style-context.tsx";
import { styles } from "~/registry/styles.ts";
import { Button } from "~/registry/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";
import { For, Show } from "solid-js";

function Swatch(props: { light: string; dark: string; class?: string }) {
  return (
    <span
      style={{ "--dot-light": props.light, "--dot-dark": props.dark }}
      class={`size-4 shrink-0 rounded-full bg-(--dot-light) dark:bg-(--dot-dark) ${
        props.class ?? ""
      }`}
    />
  );
}

/**
 * The header settings menu: switches the style and base color the whole
 * docs site renders in.
 *
 * Our chrome is built on the same registry as the components it
 * documents, so both choices apply site-wide rather than only to
 * previews. That is the point: it shows them on a real interface
 * instead of on isolated examples.
 */
export function Customizer(props: { class?: string }) {
  const { style, setStyle } = useStyle();
  const { baseColor, setBaseColor } = useBaseColor();
  const activeStyle = () => styles.find((entry) => entry.name === style());
  const activeBase = () =>
    baseColors.find((entry) => entry.name === baseColor());

  return (
    <DropdownMenu placement="bottom-end">
      <DropdownMenuTrigger
        as={Button}
        variant="ghost"
        size="icon-sm"
        class={props.class}
      >
        <IconSliders />
        <span class="sr-only">Customize</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <div class="flex flex-col">
              <span class="text-muted-foreground text-xs">Style</span>
              <span class="font-medium">{activeStyle()?.title}</span>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent class="w-56">
            <For each={styles}>
              {(entry) => (
                <DropdownMenuItem
                  closeOnSelect={false}
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
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <div class="flex flex-1 items-center justify-between gap-2 pr-2">
              <div class="flex flex-col">
                <span class="text-muted-foreground text-xs">Base Color</span>
                <span class="font-medium">{activeBase()?.title}</span>
              </div>
              <Show when={activeBase()}>
                {(base) => (
                  <Swatch light={base().dot.light} dark={base().dot.dark} />
                )}
              </Show>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent class="w-48">
            <For each={baseColors}>
              {(entry) => (
                <DropdownMenuItem
                  closeOnSelect={false}
                  onSelect={() => setBaseColor(entry.name)}
                  class="flex items-center gap-2"
                >
                  <Swatch light={entry.dot.light} dark={entry.dot.dark} />
                  <span class="flex-1 font-medium">{entry.title}</span>
                  <Show when={baseColor() === entry.name}>
                    <IconCheck class="size-4 shrink-0" />
                  </Show>
                </DropdownMenuItem>
              )}
            </For>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
