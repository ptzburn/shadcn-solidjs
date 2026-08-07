import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export function useMediaQuery(query: string): Accessor<boolean> {
  const [matches, setMatches] = createSignal(false);

  createEffect(() => {
    if (typeof globalThis.matchMedia !== "function") return;

    const mediaQuery = globalThis.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);

    onCleanup(() => {
      mediaQuery.removeEventListener("change", handler);
    });
  });

  return matches;
}
