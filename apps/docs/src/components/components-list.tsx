import { For, Show } from "solid-js";
import { A } from "@solidjs/router";

import { componentPages } from "~/config/docs.ts";

export function ComponentsList(props: { variant?: "all" | "new" }) {
  const list = () =>
    componentPages.filter(
      (component) => props.variant !== "new" || component.status === "new",
    );

  return (
    <Show when={list().length}>
      <div
        data-not-typeset
        class="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20"
      >
        <For each={list()}>
          {(component) => (
            <A
              href={component.href}
              class="inline-flex items-center gap-2 text-lg font-medium underline-offset-4 hover:underline md:text-base"
            >
              {component.title}
              <Show when={props.variant !== "new" && component.status}>
                {(status) => (
                  <>
                    <span class="sr-only">{status()}</span>
                    <span
                      aria-hidden="true"
                      class="flex size-2 rounded-full bg-blue-500"
                    />
                  </>
                )}
              </Show>
            </A>
          )}
        </For>
      </div>
    </Show>
  );
}
