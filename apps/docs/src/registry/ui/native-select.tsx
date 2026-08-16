import type { ComponentProps } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import type { Component } from "solid-js";

import { omit } from "solid-js";

// `size` on a native select is the number of visible rows; the design system
// uses it for the control height instead, so the native attribute is omitted
// exactly like upstream does.
type NativeSelectProps =
  & Omit<ComponentProps<"select">, "size">
  & { size?: "sm" | "default" };

const NativeSelect: Component<NativeSelectProps> = (props) => {
  const others = omit(props, "class", "size");
  return (
    <div
      class={cn(
        "group/native-select relative w-fit has-[select:disabled]:opacity-50",
        props.class,
      )}
      data-slot="native-select-wrapper"
      data-size={props.size ?? "default"}
    >
      <select
        data-slot="native-select"
        data-size={props.size ?? "default"}
        class="h-8 w-full min-w-0 select-none appearance-none rounded-lg border border-input bg-transparent py-1 pr-8 pl-2.5 text-sm outline-none transition-colors selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] aria-invalid:border-destructive data-[size=sm]:py-0.5 aria-invalid:ring-3 aria-invalid:ring-destructive/20"
        {...others}
      />
      <IconPlaceholder
        lucide="chevron-down"
        tabler="selector"
        ph="caret-down"
        ri="arrow-down-s-line"
        hugeicons="unfold-more"
        class="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 select-none text-muted-foreground"
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
