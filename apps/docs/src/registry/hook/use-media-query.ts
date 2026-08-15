import { type Accessor, createEffect, createSignal } from "solid-js";

export function useMediaQuery(query: string): Accessor<boolean> {
  const [matches, setMatches] = createSignal(false);

  createEffect(() => query, (q) => {
    if (typeof globalThis.matchMedia !== "function") return;

    const mediaQuery = globalThis.matchMedia(q);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  });

  return matches;
}
