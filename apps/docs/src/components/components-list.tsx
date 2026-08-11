import { A } from "@solidjs/router";
import { componentPages } from "~/config/docs.ts";

import { For, Show } from "solid-js";

export function ComponentsList() {
  return (
    <Show when={componentPages.length}>
      <div
        data-not-typeset
        class="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20"
      >
        <For each={componentPages}>
          {(component) => (
            <A
              href={component.href}
              class="inline-flex items-center gap-2 font-medium text-lg underline-offset-4 hover:underline md:text-base"
            >
              {component.title}
            </A>
          )}
        </For>
      </div>
    </Show>
  );
}
