/**
 * Active base-color state for the docs site, following the same shape as
 * style-context.tsx: every palette ships in the CSS (base-colors.css),
 * switching swaps a `.base-<name>` class on the root element, the choice
 * persists in a cookie, and BaseColorScript (rendered from Document.tsx)
 * applies it before first paint. Neutral is the site's own palette, so
 * it maps to no class at all.
 */
import { isServer, type JSX } from "@solidjs/web";
import {
  type BaseColorName,
  baseColors,
  defaultBaseColor,
  isBaseColor,
} from "~/lib/base-colors.ts";
import {
  type Accessor,
  createContext,
  createSignal,
  useContext,
} from "solid-js";

export const BASE_COLOR_COOKIE = "base-color";

/** One year, matching the style and color-mode cookies. */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function parseBaseColorCookie(
  cookie: string | undefined,
): BaseColorName {
  const match = cookie?.match(
    new RegExp(`(?:^|;\\s*)${BASE_COLOR_COOKIE}=([^;]*)`),
  );
  const value = match?.[1] ? decodeURIComponent(match[1]) : undefined;
  return value && isBaseColor(value) ? value : defaultBaseColor;
}

function applyBaseColorClass(next: BaseColorName) {
  if (isServer) return;
  const root = document.documentElement;
  for (const name of [...root.classList]) {
    if (name.startsWith("base-")) root.classList.remove(name);
  }
  if (next !== defaultBaseColor) root.classList.add(`base-${next}`);
}

type BaseColorContextValue = {
  baseColor: Accessor<BaseColorName>;
  setBaseColor: (baseColor: BaseColorName) => void;
};

const BaseColorContext = createContext<BaseColorContextValue>();

export function BaseColorProvider(
  props: { initial: BaseColorName; children: JSX.Element },
) {
  const [baseColor, set] = createSignal<BaseColorName>(props.initial);

  const setBaseColor = (next: BaseColorName) => {
    set(next);
    if (isServer) return;
    document.cookie =
      `${BASE_COLOR_COOKIE}=${next}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
    applyBaseColorClass(next);
  };

  applyBaseColorClass(props.initial);

  return (
    <BaseColorContext value={{ baseColor, setBaseColor }}>
      {props.children}
    </BaseColorContext>
  );
}

export function useBaseColor() {
  const context = useContext(BaseColorContext);
  if (!context) {
    throw new Error("useBaseColor must be used within a BaseColorProvider");
  }
  return context;
}

/**
 * Applies the stored base-color class before first paint. Render it from
 * Document.tsx: a <script> rendered from the client bundle never runs.
 */
export function BaseColorScript(props: { nonce?: string }) {
  const names = JSON.stringify(
    Object.fromEntries(baseColors.map((base) => [base.name, true])),
  );
  const script =
    `!function(){try{var k="${BASE_COLOR_COOKIE}",m=document.cookie.match(new RegExp("(^|;\\s*)"+k+"=([^;]*)")),v=m?decodeURIComponent(m[2]):"",b=${names}[v]?v:"${defaultBaseColor}",d=document.documentElement;Array.prototype.slice.call(d.classList).forEach(function(c){c.indexOf("base-")===0&&d.classList.remove(c)});b!=="${defaultBaseColor}"&&d.classList.add("base-"+b)}catch(e){}}();`;
  return (
    <script id="base-color-script" nonce={props.nonce} innerHTML={script} />
  );
}
