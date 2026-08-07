import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

import type { Component, ComponentProps } from "solid-js";

import { splitProps } from "solid-js";

// `size` on a native select is the number of visible rows; the design system
// uses it for the control height instead, so the native attribute is omitted
// exactly like upstream does.
type NativeSelectProps =
  & Omit<ComponentProps<"select">, "size">
  & { size?: "sm" | "default" };

const NativeSelect: Component<NativeSelectProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "size"]);
  return (
    <div
      class={cn(
        "cn-native-select-wrapper group/native-select relative w-fit has-[select:disabled]:opacity-50",
        local.class,
      )}
      data-slot="native-select-wrapper"
      data-size={local.size ?? "default"}
    >
      <select
        data-slot="native-select"
        data-size={local.size ?? "default"}
        class="cn-native-select outline-none disabled:pointer-events-none disabled:cursor-not-allowed"
        {...others}
      />
      <IconPlaceholder
        lucide="chevron-down"
        tabler="selector"
        ph="caret-down"
        ri="arrow-down-s-line"
        hugeicons="unfold-more"
        class="cn-native-select-icon pointer-events-none absolute select-none"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  );
};

const NativeSelectOption: Component<ComponentProps<"option">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <option
      data-slot="native-select-option"
      class={cn("bg-[Canvas] text-[CanvasText]", local.class)}
      {...others}
    />
  );
};

const NativeSelectOptGroup: Component<ComponentProps<"optgroup">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <optgroup
      data-slot="native-select-optgroup"
      class={cn("bg-[Canvas] text-[CanvasText]", local.class)}
      {...others}
    />
  );
};

export type { NativeSelectProps };
export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
