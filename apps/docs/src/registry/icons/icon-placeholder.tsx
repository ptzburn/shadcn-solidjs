import type { ComponentProps } from "@solidjs/web";
import { Dynamic } from "@solidjs/web";
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
  return <Dynamic component={lucideIcons[props.lucide]} {...rest} />;
};

export { IconPlaceholder };
