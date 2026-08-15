import type { JSX } from "@solidjs/web";
import { createEffect, createSignal, Show } from "solid-js";

/**
 * Renders children on the client only, after hydration.
 *
 * Temporary Solid 2 RC workaround: Kobalte's collection-based primitives
 * (tabs, accordion) compute divergent server/client hydration keys in
 * their internals, and the mismatch halts the page's reactive system
 * (kobaltedev/kobalte#717 is the same underlying Solid issue). Skipping
 * SSR for those subtrees means there is nothing to mis-hydrate; the
 * widget mounts fresh on the client and is fully interactive. Remove
 * once the upstream hydration-key divergence is fixed.
 */
export function ClientOnly(props: { children?: JSX.Element }): JSX.Element {
  const [mounted, setMounted] = createSignal(false);
  createEffect(() => {}, () => {
    setMounted(true);
  });
  return <Show when={mounted()}>{props.children}</Show>;
}
