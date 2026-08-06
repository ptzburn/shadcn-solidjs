import {
  type Component,
  type ComponentProps,
  mergeProps,
  Show,
  splitProps,
} from "solid-js";

import { cn } from "~/lib/utils.ts";

type DeltaBarProps = ComponentProps<"div"> & {
  value: number;
  isIncreasePositive?: boolean;
};

const DeltaBar: Component<DeltaBarProps> = (rawProps) => {
  const props = mergeProps(
    {
      isIncreasePositive: true,
    },
    rawProps,
  );
  const [local, others] = splitProps(props, [
    "value",
    "isIncreasePositive",
    "class",
  ]);

  const barColor = () =>
    (local.value > 0 && local.isIncreasePositive) ||
      (local.value < 0 && !local.isIncreasePositive)
      ? "cn-delta-bar-favorable"
      : "cn-delta-bar-unfavorable";

  return (
    <div
      class={cn(
        "cn-delta-bar relative flex w-full items-center",
        local.class,
      )}
      {...others}
    >
      <div class="cn-delta-bar-negative-half flex h-full w-1/2 justify-end">
        <Show when={local.value < 0}>
          <div
            class={cn("cn-delta-bar-negative-bar", barColor())}
            style={{ width: `${Math.abs(local.value)}%` }}
          />
        </Show>
      </div>
      <div
        class={cn(
          "cn-delta-bar-origin z-10",
          barColor(),
        )}
      />
      <div class="cn-delta-bar-positive-half flex h-full w-1/2 justify-start">
        <Show when={local.value > 0}>
          <div
            class={cn("cn-delta-bar-positive-bar", barColor())}
            style={{ width: `${Math.abs(local.value)}%` }}
          />
        </Show>
      </div>
    </div>
  );
};

export { DeltaBar };
export type { DeltaBarProps };
