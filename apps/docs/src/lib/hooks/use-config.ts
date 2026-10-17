import { type Accessor, createEffect, createSignal } from "solid-js";

/**
 * Port of the upstream `useConfig` jotai atom: one module-level signal
 * shared by every consumer, persisted to localStorage. Hydrated after
 * mount so server and client render the same initial markup.
 */
export type Config = {
  installationType: "cli" | "manual";
  packageManager: "npm" | "yarn" | "pnpm" | "bun";
};

const STORAGE_KEY = "config";

const defaultConfig: Config = {
  installationType: "cli",
  packageManager: "pnpm",
};

const PACKAGE_MANAGERS: ReadonlySet<string> = new Set(["npm", "yarn", "pnpm", "bun"]);

/**
 * Merges a stored config over the defaults, dropping a package manager the
 * tabs no longer offer: a visitor who picked `deno` before it was removed
 * would otherwise see an empty command block.
 */
export function sanitizeConfig(stored: unknown): Config {
  const merged = { ...defaultConfig, ...(stored as Partial<Config>) };
  if (!PACKAGE_MANAGERS.has(merged.packageManager)) {
    merged.packageManager = defaultConfig.packageManager;
  }
  return merged;
}

const [config, setConfigSignal] = createSignal<Config>(defaultConfig);

let hydrated = false;

export function useConfig(): [Accessor<Config>, (partial: Partial<Config>) => void] {
  // Effects only run on the client, standing in for Solid 1's onMount.
  createEffect(
    () => {},
    () => {
      if (hydrated) return;
      hydrated = true;
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setConfigSignal(sanitizeConfig(JSON.parse(stored)));
        }
      } catch {
        // Corrupted storage — keep the defaults.
      }
    },
  );

  const setConfig = (partial: Partial<Config>) => {
    const next = { ...config(), ...partial };
    setConfigSignal(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable — the selection just won't persist.
    }
  };

  return [config, setConfig];
}
