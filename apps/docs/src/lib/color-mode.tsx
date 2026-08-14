// Local Solid 2 shim — @kobalte/core@2.0.0-alpha.0's color-mode runs its
// sync effect on the server and touches `document`, crashing SSR. Mirrors
// Kobalte's API so imports can swap back once it is fixed upstream.
import { isServer } from "@solidjs/web";

import {
  type Accessor,
  createContext,
  createSignal,
  onCleanup,
  type ParentProps,
  useContext,
} from "solid-js";

export type ColorMode = "light" | "dark";
export type ConfigColorMode = ColorMode | "system";

export interface ColorModeStorageManager {
  type: "cookie" | "localStorage";
  ssr?: boolean;
  get: (fallback?: ConfigColorMode) => ConfigColorMode | undefined;
  set: (value: ConfigColorMode) => void;
}

export interface ColorModeContextType {
  colorMode: Accessor<ColorMode>;
  setColorMode: (value: ConfigColorMode) => void;
  toggleColorMode: () => void;
}

export const COLOR_MODE_STORAGE_KEY = "kb-color-mode";

const FALLBACK_COLOR_MODE: ConfigColorMode = "system";

function normalize(value: string | undefined): ConfigColorMode | undefined {
  return value === "light" || value === "dark" || value === "system"
    ? value
    : undefined;
}

export function cookieStorageManagerSSR(
  cookie: string,
): ColorModeStorageManager {
  return {
    type: "cookie",
    ssr: true,
    get: (fallback) => {
      const match = cookie.match(
        new RegExp(`(^| )${COLOR_MODE_STORAGE_KEY}=([^;]+)`),
      );
      return normalize(match?.[2]) ?? fallback;
    },
    set: (value) => {
      if (isServer) return;
      document.cookie =
        `${COLOR_MODE_STORAGE_KEY}=${value}; max-age=31536000; path=/`;
    },
  };
}

function systemColorMode(): ColorMode {
  return globalThis.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveColorMode(config: ConfigColorMode): ColorMode {
  if (config === "system") return isServer ? "light" : systemColorMode();
  return config;
}

const ColorModeContext = createContext<ColorModeContextType>();

export function useColorMode(): ColorModeContextType {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error("useColorMode must be used within a ColorModeProvider");
  }
  return context;
}

export function ColorModeProvider(
  props: ParentProps<{
    initialColorMode?: ConfigColorMode;
    storageManager?: ColorModeStorageManager;
  }>,
) {
  const manager = () => props.storageManager ?? cookieStorageManagerSSR("");
  const initialConfig = manager().get() ??
    props.initialColorMode ?? FALLBACK_COLOR_MODE;

  const [colorMode, rawSetColorMode] = createSignal(
    resolveColorMode(initialConfig),
  );

  let cleanupSystemListener: (() => void) | undefined;
  onCleanup(() => cleanupSystemListener?.());

  const applyColorMode = (value: ColorMode) => {
    rawSetColorMode(value);
    if (isServer) return;
    document.documentElement.dataset.kbTheme = value;
    document.documentElement.style.colorScheme = value;
  };

  const listenToSystem = () => {
    if (isServer) return;
    const query = globalThis.matchMedia("(prefers-color-scheme: dark)");
    const listener = (event: MediaQueryListEvent) => {
      applyColorMode(event.matches ? "dark" : "light");
    };
    query.addEventListener("change", listener);
    cleanupSystemListener = () => query.removeEventListener("change", listener);
  };

  const setColorMode = (value: ConfigColorMode) => {
    cleanupSystemListener?.();
    cleanupSystemListener = undefined;
    if (value === "system") listenToSystem();
    applyColorMode(resolveColorMode(value));
    manager().set(value);
  };

  // Follow OS preference changes when the stored choice is "system".
  if (initialConfig === "system") listenToSystem();

  const context: ColorModeContextType = {
    colorMode,
    setColorMode,
    toggleColorMode: () => {
      setColorMode(colorMode() === "dark" ? "light" : "dark");
    },
  };

  return <ColorModeContext value={context}>{props.children}</ColorModeContext>;
}

export function ColorModeScript(props: {
  storageType?: "cookie" | "localStorage";
  storageKey?: string;
  initialColorMode?: ConfigColorMode;
  nonce?: string;
}) {
  const init = normalize(props.initialColorMode) ?? FALLBACK_COLOR_MODE;
  const storageKey = props.storageKey ?? COLOR_MODE_STORAGE_KEY;

  // Runs before paint: resolve the stored (or initial) mode and stamp the
  // documentElement so the first frame already has the right theme.
  const apply =
    `var a=function(c){var m="(prefers-color-scheme: dark)",s=window.matchMedia(m).matches?"dark":"light",r=c==="system"?s:c,d=document.documentElement;return d.style.colorScheme=r,d.dataset.kbTheme=r,c};`;
  const cookieScript = `!function(){try{${apply}` +
    `var k="${storageKey}",t=document.cookie.match(new RegExp("(^| )"+k+"=([^;]+)")),c=t?t[2]:null;` +
    `c?a(c):document.cookie=k+"="+a("${init}")+"; max-age=31536000; path=/"}catch(e){}}();`;
  const localStorageScript = `!function(){try{${apply}` +
    `var k="${storageKey}",t=localStorage.getItem(k);` +
    `t?a(t):localStorage.setItem(k,a("${init}"))}catch(e){}}();`;

  return (
    <script
      id="kb-color-mode-script"
      nonce={props.nonce}
      innerHTML={props.storageType === "cookie"
        ? cookieScript
        : localStorageScript}
    />
  );
}
