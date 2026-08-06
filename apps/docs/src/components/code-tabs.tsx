import type { ComponentProps } from "solid-js";

import { type Config, useConfig } from "~/lib/hooks/use-config.ts";
import { Tabs } from "~/registry/ui/tabs.tsx";

/**
 * Port of the upstream CodeTabs: installation tabs whose Command/Manual
 * choice persists across pages via the shared config.
 */
export function CodeTabs(props: ComponentProps<typeof Tabs>) {
  const [config, setConfig] = useConfig();

  return (
    <Tabs
      {...props}
      value={config().installationType}
      onChange={(value) =>
        setConfig({
          installationType: value as Config["installationType"],
        })}
      class="relative mt-6 w-full *:data-[slot=tabs-list]:gap-6"
    />
  );
}
