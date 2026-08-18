/**
 * Active-style state for the docs site.
 *
 * Every style's tokens are loaded at once (see app.css), each scoped
 * under `.style-<name>`, so switching is just swapping that class on the
 * root element -- no rebuild and no reload.
 *
 * The choice persists in a cookie. With client rendering, StyleScript
 * (rendered from Document.tsx, the server-rendered shell) applies the
 * stored class before first paint; the provider then keeps it in sync.
 */
import { isServer, type JSX } from "@solidjs/web";
import {
  defaultStyle,
  isStyle,
  type StyleName,
  styleNames,
} from "~/registry/styles.ts";
import {
  type Accessor,
  createContext,
  createSignal,
  useContext,
} from "solid-js";

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

function applyStyleClass(next: StyleName) {
  if (isServer) return;
  const root = document.documentElement;
  for (const name of [...root.classList]) {
    if (name.startsWith("style-")) root.classList.remove(name);
  }
  root.classList.add(`style-${next}`);
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
    if (isServer) return;
    document.cookie =
      `${STYLE_COOKIE}=${next}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
    applyStyleClass(next);
  };

  // Keep the document in step with the stored choice even before (or
  // without) the inline script.
  applyStyleClass(props.initial);

  return (
    <StyleContext value={{ style, setStyle }}>{props.children}</StyleContext>
  );
}

export function useStyle() {
  const context = useContext(StyleContext);
  if (!context) {
    throw new Error("useStyle must be used within a StyleProvider");
  }
  return context;
}

/**
 * Applies the stored style class before first paint. Render it from
 * Document.tsx: a <script> rendered from the client bundle never runs.
 */
export function StyleScript(props: { nonce?: string }) {
  const names = JSON.stringify(
    Object.fromEntries(styleNames.map((name) => [name, true])),
  );
  const script =
    `!function(){try{var k="${STYLE_COOKIE}",m=document.cookie.match(new RegExp("(^|;\\s*)"+k+"=([^;]*)")),v=m?decodeURIComponent(m[2]):"",s=${names}[v]?v:"${defaultStyle}",d=document.documentElement;Array.prototype.slice.call(d.classList).forEach(function(c){c.indexOf("style-")===0&&d.classList.remove(c)});d.classList.add("style-"+s)}catch(e){}}();`;
  return <script id="style-script" nonce={props.nonce} innerHTML={script} />;
}
