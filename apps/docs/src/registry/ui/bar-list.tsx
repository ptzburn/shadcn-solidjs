import type { ComponentProps, JSX } from "solid-js";
import { For, mergeProps, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { cn } from "~/lib/utils.ts";

type Bar<T> = T & {
  value: number;
  name: JSX.Element;
  icon?: (props: ComponentProps<"svg">) => JSX.Element;
  href?: string;
  target?: string;
};

type SortOrder = "ascending" | "descending" | "none";

type ValueFormatter = (value: number) => string;

const defaultValueFormatter: ValueFormatter = (value: number) =>
  value.toString();

type BarListProps<T> = ComponentProps<"div"> & {
  data: Bar<T>[];
  valueFormatter?: ValueFormatter;
  sortOrder?: SortOrder;
};

const BarList = <T,>(rawProps: BarListProps<T>) => {
  const props = mergeProps(
    {
      valueFormatter: defaultValueFormatter,
      sortOrder: "descending" as SortOrder,
    },
    rawProps,
  );
  const [local, others] = splitProps(props, [
    "class",
    "data",
    "valueFormatter",
    "sortOrder",
  ]);

  const sortedData = () => {
    if (local.sortOrder === "none") {
      return local.data;
    }
    return local.data.sort((a, b) =>
      local.sortOrder === "ascending" ? a.value - b.value : b.value - a.value
    );
  };

  const widths = () => {
    const maxValue = Math.max(...sortedData().map((item) => item.value), 0);
    return sortedData().map((item) =>
      item.value === 0 ? 0 : Math.max((item.value / maxValue) * 100, 2)
    );
  };

  return (
    <div
      class={cn("cn-bar-list flex flex-col", local.class)}
      aria-sort={local.sortOrder}
      {...others}
    >
      <For each={sortedData()}>
        {(bar, idx) => {
          return (
            <div class="cn-bar-list-item row flex w-full justify-between">
              <div class="cn-bar-list-bar-wrapper grow">
                <div
                  class={cn(
                    "cn-bar-list-bar flex items-center",
                  )}
                  style={{
                    width: `${widths()[idx()]}%`,
                  }}
                >
                  <Show when={bar.icon}>
                    {(icon) => (
                      <Dynamic
                        component={icon()}
                        class="cn-bar-list-icon flex-none"
                      />
                    )}
                  </Show>
                  <Show when={bar.href} fallback={<p>{bar.name}</p>}>
                    {(href) => (
                      <a
                        href={href()}
                        target={bar.target ?? "_blank"}
                        rel="noreferrer"
                        class="cn-bar-list-link"
                      >
                        {bar.name}
                      </a>
                    )}
                  </Show>
                </div>
              </div>
              <div class="cn-bar-list-value flex items-center">
                {local.valueFormatter(bar.value)}
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
};

export { BarList };
