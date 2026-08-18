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
export type MaybeConfigColorMode = ConfigColorMode | undefined;

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

export interface ColorModeProviderProps {
  initialColorMode?: ConfigColorMode;
  storageManager?: ColorModeStorageManager;
}

export interface ColorModeScriptProps {
  initialColorMode?: ConfigColorMode;
  storageType?: "cookie" | "localStorage";
  storageKey?: string;
  nonce?: string;
}

export const COLOR_MODE_STORAGE_KEY = "kb-color-mode";

const FALLBACK_COLOR_MODE: ConfigColorMode = "system";

function normalize(value: string | null | undefined): MaybeConfigColorMode {
  return value === "light" || value === "dark" || value === "system"
    ? value
    : undefined;
}

export function createLocalStorageManager(
  key: string,
): ColorModeStorageManager {
  return {
    type: "localStorage",
    ssr: false,
    get: (fallback) => {
      if (isServer) return fallback;
      try {
        return normalize(localStorage.getItem(key)) ?? fallback;
      } catch {
        return fallback;
      }
    },
    set: (value) => {
      try {
        localStorage.setItem(key, value);
      } catch {
        return;
      }
    },
  };
}

export const localStorageManager = createLocalStorageManager(
  COLOR_MODE_STORAGE_KEY,
);

function parseCookie(cookie: string, key: string): MaybeConfigColorMode {
  const match = cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
  return normalize(match?.[2]);
}

export function createCookieStorageManager(
  key: string,
  cookie?: string,
): ColorModeStorageManager {
  return {
    type: "cookie",
    ssr: !!cookie,
    get: (fallback) => {
      if (cookie) return parseCookie(cookie, key) ?? fallback;
      if (isServer) return fallback;
      return parseCookie(document.cookie, key) ?? fallback;
    },
    set: (value) => {
      if (isServer) return;
      document.cookie = `${key}=${value}; max-age=31536000; path=/`;
    },
  };
}

export const cookieStorageManager = createCookieStorageManager(
  COLOR_MODE_STORAGE_KEY,
);

export function cookieStorageManagerSSR(
  cookie: string,
): ColorModeStorageManager {
  return createCookieStorageManager(COLOR_MODE_STORAGE_KEY, cookie);
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

export function useColorModeValue<TLight = unknown, TDark = unknown>(
  light: TLight,
  dark: TDark,
): Accessor<TLight | TDark> {
  const { colorMode } = useColorMode();
  return () => (colorMode() === "dark" ? dark : light);
}

export function ColorModeProvider(props: ParentProps<ColorModeProviderProps>) {
  const manager = () => props.storageManager ?? localStorageManager;
  const initialConfig = manager().get() ??
    props.initialColorMode ?? FALLBACK_COLOR_MODE;
  const initialMode = resolveColorMode(initialConfig);
  const [colorMode, rawSetColorMode] = createSignal(initialMode);

  let cleanupSystemListener: (() => void) | undefined;
  onCleanup(() => cleanupSystemListener?.());

  const stampDocument = (value: ColorMode) => {
    if (isServer) return;
    document.documentElement.dataset.kbTheme = value;
    document.documentElement.style.colorScheme = value;
  };

  const applyColorMode = (value: ColorMode) => {
    rawSetColorMode(value);
    stampDocument(value);
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

  stampDocument(initialMode);
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

export function ColorModeScript(props: ColorModeScriptProps) {
  const init = normalize(props.initialColorMode) ?? FALLBACK_COLOR_MODE;
  const storageKey = props.storageKey ?? COLOR_MODE_STORAGE_KEY;
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
