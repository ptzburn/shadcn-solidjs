/**
 * Active-style state for the docs site.
 *
 * Every style's tokens are loaded at once (see app.css), each scoped
 * under `.style-<name>`, so switching is just swapping that class on
 * <body> -- no rebuild and no reload.
 *
 * The choice persists in a cookie rather than localStorage so the server
 * renders the right class on the first response; entry-server.tsx reads
 * the same cookie. localStorage would only be readable after hydration,
 * which means a flash of the default style on every navigation.
 */
import { defaultStyle, isStyle, type StyleName } from "~/registry/styles.ts";
import {
  type Accessor,
  createContext,
  createSignal,
  type JSX,
  useContext,
} from "solid-js";

import { isServer } from "solid-js/web";

export const STYLE_COOKIE = "style";

/** One year, matching how the color-mode cookie is persisted. */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Reads a style name from a cookie header (server) or document.cookie
 * (client), falling back to the default for anything unrecognised so a
 * hand-edited cookie can never inject a class name.
 */
export function parseStyleCookie(cookie: string | undefined): StyleName {
  const match = cookie?.match(
    new RegExp(`(?:^|;\\s*)${STYLE_COOKIE}=([^;]*)`),
  );
  const value = match?.[1] ? decodeURIComponent(match[1]) : undefined;
  return value && isStyle(value) ? value : defaultStyle;
}

type StyleContextValue = {
  style: Accessor<StyleName>;
  setStyle: (style: StyleName) => void;
};

const StyleContext = createContext<StyleContextValue>();

export function StyleProvider(
  props: { initial: StyleName; children: JSX.Element },
) {
  const [style, set] = createSignal<StyleName>(props.initial);

  const setStyle = (next: StyleName) => {
    set(next);
    if (isServer) {
      return;
    }
    document.cookie =
      `${STYLE_COOKIE}=${next}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
    // The class lives on <body>, which sits outside the router root, so
    // it is swapped directly rather than through JSX.
    for (const name of [...document.body.classList]) {
      if (name.startsWith("style-")) {
        document.body.classList.remove(name);
      }
    }
    document.body.classList.add(`style-${next}`);
  };

  return (
    <StyleContext.Provider value={{ style, setStyle }}>
      {props.children}
    </StyleContext.Provider>
  );
}

export function useStyle() {
  const context = useContext(StyleContext);
  if (!context) {
    throw new Error("useStyle must be used within a StyleProvider");
  }
  return context;
}
