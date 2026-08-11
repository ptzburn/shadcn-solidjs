import {
  type LucideIconName,
  lucideIcons,
} from "~/registry/icons/__lucide__/index.tsx";
import { type ComponentProps, splitProps } from "solid-js";

import { Dynamic } from "solid-js/web";

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
  const [local, rest] = splitProps(props, [
    "lucide",
    "tabler",
    "ph",
    "ri",
    "hugeicons",
  ]);
  return <Dynamic component={lucideIcons[local.lucide]} {...rest} />;
};

export { IconPlaceholder };
