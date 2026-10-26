/**
 * Active-style state for the docs site.
 *
 * Each style's tokens live in their own stylesheet, scoped under
 * `.style-<name>` (see lib/style-sheets.ts). Switching loads the new sheet,
 * then swaps that class on the root element -- no rebuild and no reload.
 *
 * The choice persists in a cookie. StyleScript (rendered from Document.tsx,
 * so it arrives as HTML) applies the stored class and points the style
 * sheet at it before first paint; the provider then keeps both in sync.
 */
import { isServer, type JSX } from "@solidjs/web";
import { STYLE_SHEET_ID, styleSheets } from "~/lib/style-sheets.ts";
import { defaultStyle, isStyle, type StyleName, styleNames } from "~/registry/styles.ts";
import { type Accessor, createContext, createSignal, useContext } from "solid-js";

export const STYLE_COOKIE = "style";

/** One year, matching how the color-mode cookie is persisted. */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Reads a style name from a cookie header (server) or document.cookie
 * (client), falling back to the default for anything unrecognised so a
 * hand-edited cookie can never inject a class name.
 */
export function parseStyleCookie(cookie: string | undefined): StyleName {
  const match = cookie?.match(new RegExp(`(?:^|;\\s*)${STYLE_COOKIE}=([^;]*)`));
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

/**
 * Points the style sheet at `next`, resolving once it has loaded. The new
 * sheet loads beside the old one, which goes only after, so the page is
 * never left without a style.
 */
function loadStyleSheet(next: StyleName): Promise<void> {
  if (isServer) return Promise.resolve();
  const current = document.getElementById(STYLE_SHEET_ID) as HTMLLinkElement | null;
  const href = styleSheets[next];
  if (!current || current.getAttribute("href") === href) return Promise.resolve();
  const incoming = current.cloneNode() as HTMLLinkElement;
  incoming.removeAttribute("id");
  incoming.href = href;
  return new Promise((resolve) => {
    const settle = () => {
      current.remove();
      incoming.id = STYLE_SHEET_ID;
      resolve();
    };
    incoming.addEventListener("load", settle, { once: true });
    incoming.addEventListener("error", settle, { once: true });
    current.after(incoming);
  });
}

type StyleContextValue = {
  style: Accessor<StyleName>;
  setStyle: (style: StyleName) => void;
};

const StyleContext = createContext<StyleContextValue>();

export function StyleProvider(props: { initial: StyleName; children: JSX.Element }) {
  const [style, set] = createSignal<StyleName>(props.initial);

  const setStyle = (next: StyleName) => {
    set(next);
    if (isServer) return;
    document.cookie = `${STYLE_COOKIE}=${next}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
    void loadStyleSheet(next).then(() => {
      if (style() === next) applyStyleClass(next);
    });
  };

  // Keep the document in step with the stored choice even before (or
  // without) the inline script.
  void loadStyleSheet(props.initial);
  applyStyleClass(props.initial);

  return <StyleContext value={{ style, setStyle }}>{props.children}</StyleContext>;
}

export function useStyle() {
  const context = useContext(StyleContext);
  if (!context) {
    throw new Error("useStyle must be used within a StyleProvider");
  }
  return context;
}

/**
 * Applies the stored style class and points the style sheet at it before
 * first paint. Render it from Document.tsx, after the sheet's <link>: a
 * <script> rendered from the client bundle never runs.
 */
export function StyleScript(props: { nonce?: string }) {
  const sheets = JSON.stringify(
    Object.fromEntries(styleNames.map((name) => [name, styleSheets[name]])),
  );
  const script = `!function(){try{var k="${STYLE_COOKIE}",u=${sheets},m=document.cookie.match(new RegExp("(^|;\\s*)"+k+"=([^;]*)")),v=m?decodeURIComponent(m[2]):"",s=u[v]?v:"${defaultStyle}",d=document.documentElement,l=document.getElementById("${STYLE_SHEET_ID}");Array.prototype.slice.call(d.classList).forEach(function(c){c.indexOf("style-")===0&&d.classList.remove(c)});d.classList.add("style-"+s);l&&l.getAttribute("href")!==u[s]&&(l.href=u[s])}catch(e){}}();`;
  return <script id="style-script" nonce={props.nonce} innerHTML={script} />;
}
