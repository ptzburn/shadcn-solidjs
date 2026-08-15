import type { ComponentProps } from "@solidjs/web";
import {
  type LucideIconName,
  lucideIcons,
} from "~/registry/icons/__lucide__/index.tsx";

import { omit } from "solid-js";

export interface IconPlaceholderProps extends ComponentProps<"svg"> {
  lucide: LucideIconName;
  tabler: string;
  ph: string;
  ri: string;
  hugeicons: string;
}

/**
 * Marker component for registry icons. Authored components declare the icon
 * name for every supported library; the registry build resolves the marker
 * into a concrete `~icons/<library>/<name>` import per icon library, so this
 * component never ships to consumers. The docs site renders the default
 * library (lucide).
 */
const IconPlaceholder = (props: IconPlaceholderProps) => {
  const rest = omit(props, "lucide", "tabler", "ph", "ri", "hugeicons");
  // Direct call instead of <Dynamic>: a Dynamic child inside a Kobalte
  // primitive computes divergent server/client hydration keys under the
  // Solid 2 RC and crashes hydration (see the mdx-components note and
  // kobaltedev/kobalte#717). The marker's icon name is static by design,
  // so the lost reactivity on `lucide` is irrelevant.
  return lucideIcons[props.lucide](rest);
};

export { IconPlaceholder };
