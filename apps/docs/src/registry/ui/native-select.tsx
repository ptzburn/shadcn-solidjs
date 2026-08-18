import type { ComponentProps } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import type { Component } from "solid-js";

import { omit } from "solid-js";

type NativeSelectProps =
  & Omit<ComponentProps<"select">, "size">
  & { size?: "sm" | "default" };

const NativeSelect: Component<NativeSelectProps> = (props) => {
  const others = omit(props, "class", "size");
  return (
    <div
      class={cn(
        "cn-native-select-wrapper group/native-select relative w-fit has-[select:disabled]:opacity-50",
        props.class,
      )}
      data-slot="native-select-wrapper"
      data-size={props.size ?? "default"}
    >
      <select
        data-slot="native-select"
        data-size={props.size ?? "default"}
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
  const others = omit(props, "class");
  return (
    <option
      data-slot="native-select-option"
      class={cn("bg-[Canvas] text-[CanvasText]", props.class)}
      {...others}
    />
  );
};

const NativeSelectOptGroup: Component<ComponentProps<"optgroup">> = (props) => {
  const others = omit(props, "class");
  return (
    <optgroup
      data-slot="native-select-optgroup"
      class={cn("bg-[Canvas] text-[CanvasText]", props.class)}
      {...others}
    />
  );
};

export type { NativeSelectProps };
export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
