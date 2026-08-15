import type { JSX } from "@solidjs/web";
import { createSignal, onSettled, Show } from "solid-js";

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
  // onSettled rather than an effect: hydration loads route modules
  // asynchronously, and an effect can fire while later siblings are still
  // claiming server nodes — mounting then shifts their hydration keys and
  // halts the page. onSettled waits for all pending async to settle first.
  onSettled(() => {
    setMounted(true);
  });
  return <Show when={mounted()}>{props.children}</Show>;
}
