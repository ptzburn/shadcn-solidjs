import type { Ref } from "@solid-primitives/refs";
import { mergeRefs } from "@solid-primitives/refs";
import { cn } from "~/lib/utils.ts";

import type {
  ChartComponent,
  ChartData,
  ChartItem,
  ChartOptions,
  ChartType,
  ChartTypeRegistry,
  Plugin as ChartPlugin,
  TooltipModel,
} from "chart.js";
import {
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  CategoryScale,
  Chart,
  Colors,
  DoughnutController,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  ScatterController,
  Tooltip,
} from "chart.js";
import { merge } from "chart.js/helpers";
import type { Component, ComponentProps } from "solid-js";
import {
  createEffect,
  createSignal,
  createUniqueId,
  mergeProps,
  on,
  onCleanup,
  onMount,
  Show,
  splitProps,
} from "solid-js";

// Format: { THEME_NAME: CSS_SELECTOR }. Kobalte's color mode sets
// `data-kb-theme` on the root element instead of radix's `.dark` class,
// so the dark prefix matches both.
const THEMES = {
  light: "",
  dark: ":where(.dark, [data-kb-theme=dark])",
} as const;

export type ChartConfig = Record<
  string,
  & {
    label?: string;
  }
  & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>;

const ChartContainer: Component<
  ComponentProps<"div"> & {
    config: ChartConfig;
  }
> = (props) => {
  const [local, others] = splitProps(props, [
    "id",
    "class",
    "children",
    "config",
  ]);
  const uniqueId = createUniqueId();
  const chartId = () => `chart-${local.id ?? uniqueId}`;

  return (
    <div
      data-slot="chart"
      data-chart={chartId()}
      class={cn(
        "cn-chart flex aspect-video justify-center text-xs",
        local.class,
      )}
      {...others}
    >
      <ChartStyle id={chartId()} config={local.config} />
      {local.children}
    </div>
  );
};

const ChartStyle: Component<{ id: string; config: ChartConfig }> = (props) => {
  const colorConfig = () =>
    Object.entries(props.config).filter(
      ([, config]) => config.theme ?? config.color,
    );

  const styles = () =>
    Object.entries(THEMES)
      .map(
        ([theme, prefix]) => `
${prefix} [data-chart=${props.id}] {
${
          colorConfig()
            .map(([key, itemConfig]) => {
              const color =
                itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ??
                  itemConfig.color;
              return color ? `  --color-${key}: ${color};` : null;
            })
            .join("\n")
        }
}
`,
      )
      .join("\n");

  return (
    <Show when={colorConfig().length}>
      <style innerHTML={styles()} />
    </Show>
  );
};

/**
 * chart.js draws to a canvas, which cannot resolve CSS variables, so
 * `var(--…)` and `color-mix(…)` color strings in data and options are
 * resolved against the chart's container element before they reach
 * chart.js (and re-resolved whenever the theme changes).
 */
const CSS_COLOR_FUNCTION = /\bvar\(--|\bcolor-mix\(/;

function resolveCssColor(element: Element, color: string): string {
  const probe = document.createElement("span");
  probe.style.color = color;
  probe.style.display = "none";
  element.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved || color;
}

function resolveColors<T>(value: T, element: Element): T {
  if (typeof value === "string" && CSS_COLOR_FUNCTION.test(value)) {
    return resolveCssColor(element, value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((entry) => resolveColors(entry, element)) as T;
  }
  if (
    value !== null &&
    typeof value === "object" &&
    (value as object).constructor === Object
  ) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        resolveColors(entry, element),
      ]),
    ) as T;
  }
  return value;
}

export type ChartTooltipOptions = {
  indicator?: "dot" | "line" | "dashed";
  hideLabel?: boolean;
  hideIndicator?: boolean;
};

type TypedChartProps =
  & Omit<ComponentProps<"canvas">, "children" | "height" | "ref" | "width">
  & {
    data: ChartData;
    options?: ChartOptions;
    plugins?: ChartPlugin[];
    tooltip?: ChartTooltipOptions;
    ref?: Ref<HTMLCanvasElement | null>;
    width?: number | undefined;
    height?: number | undefined;
  };

type ChartProps = TypedChartProps & {
  type: ChartType;
};

type ChartContext = {
  chart: Chart;
  tooltip: TooltipModel<keyof ChartTypeRegistry>;
};

const BaseChart: Component<ChartProps> = (rawProps) => {
  const [canvasRef, setCanvasRef] = createSignal<HTMLCanvasElement | null>();
  const [chart, setChart] = createSignal<Chart>();

  const props = mergeProps(
    {
      width: 512,
      height: 512,
      options: { responsive: true } as ChartOptions,
      plugins: [] as ChartPlugin[],
    },
    rawProps,
  );
  // `tooltip` is split off so it never reaches the canvas element; the
  // typed chart components wire it into the external tooltip handler.
  const [local, others] = splitProps(props, [
    "type",
    "data",
    "options",
    "plugins",
    "tooltip",
    "ref",
    "width",
    "height",
  ]);

  const resolveElement = () => {
    const canvas = canvasRef();
    return canvas?.parentElement ?? canvas!;
  };

  const init = () => {
    const ctx = canvasRef()?.getContext("2d") as ChartItem;
    const element = resolveElement();
    const instance = new Chart(ctx, {
      type: local.type,
      data: resolveColors(local.data, element),
      options: resolveColors(local.options, element),
      plugins: local.plugins,
    });
    setChart(instance);
  };

  onMount(() => init());

  createEffect(
    on(
      () => local.data,
      () => {
        chart()!.data = resolveColors(local.data, resolveElement());
        chart()!.update();
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      () => local.options,
      () => {
        chart()!.options = resolveColors(local.options, resolveElement());
        chart()!.update();
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      [() => local.width, () => local.height],
      () => {
        chart()!.resize(local.width, local.height);
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      () => local.type,
      () => {
        const dimensions = [chart()!.width, chart()!.height];
        chart()!.destroy();
        init();
        chart()!.resize(...dimensions);
      },
      { defer: true },
    ),
  );

  // Canvas colors are baked in at draw time — re-resolve them when the
  // theme changes so charts follow light/dark switches.
  onMount(() => {
    const observer = new MutationObserver(() => {
      const instance = chart();
      if (!instance) {
        return;
      }
      const element = resolveElement();
      instance.data = resolveColors(local.data, element);
      instance.options = resolveColors(local.options, element);
      instance.update();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-kb-theme"],
    });
    onCleanup(() => observer.disconnect());
  });

  onCleanup(() => {
    chart()?.destroy();
    // The HTML tooltip element is shared across charts; remove it so it
    // cannot outlive an unmounted chart — the next hover on a still
    // mounted chart recreates it.
    document.getElementById("chartjs-tooltip")?.remove();
  });

  Chart.register(Colors, Filler, Legend, Tooltip);
  return (
    <canvas
      ref={mergeRefs(local.ref, (el) => setCanvasRef(el))}
      height={local.height}
      width={local.width}
      {...others}
    />
  );
};

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * Upstream drives the indicator from a single series color. chart.js
 * exposes a background/border pair per item — the background is the
 * series' ink for most chart types while the border can default to a
 * near-invisible rgba(0,0,0,0.1) — and either can be a gradient or
 * pattern, so use the first plain color string for both custom
 * properties and skip the declaration entirely when there is none.
 */
function indicatorStyle(
  colors: { backgroundColor: unknown; borderColor: unknown } | undefined,
): string {
  const color = [colors?.backgroundColor, colors?.borderColor].find(
    (value): value is string => typeof value === "string",
  );
  if (!color) {
    return "";
  }
  const value = escapeHtml(color);
  return `--color-bg: ${value}; --color-border: ${value};`;
}

function showTooltip(context: ChartContext, options?: ChartTooltipOptions) {
  let el = document.getElementById("chartjs-tooltip");
  if (!el) {
    el = document.createElement("div");
    el.id = "chartjs-tooltip";
    document.body.appendChild(el);
  }

  const model = context.tooltip;
  if (model.opacity === 0 || !model.body.length) {
    el.style.opacity = "0";
    return;
  }

  const indicator = options?.indicator ?? "dot";
  const nestLabel = model.dataPoints.length === 1 && indicator !== "dot";

  el.className = "cn-chart-tooltip grid min-w-32 items-start";

  const label = options?.hideLabel ? "" : model.title
    .map((title) => `<div class="font-medium">${escapeHtml(title)}</div>`)
    .join("");

  let content = nestLabel ? "" : label;

  content += `<div class="grid gap-1.5">`;
  model.dataPoints.forEach((item, index) => {
    const colors = model.labelColors[index];
    const name = item.dataset.label ?? item.label;
    const indicatorHtml = options?.hideIndicator ? "" : `
          <div class="${
      cn(
        "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
        {
          "h-2.5 w-2.5": indicator === "dot",
          "w-1": indicator === "line",
          "w-0 border-dashed border-[1.5px] bg-transparent":
            indicator === "dashed",
          "my-0.5": nestLabel && indicator === "dashed",
        },
      )
    }" style="${indicatorStyle(colors)}"></div>`;
    content += `
        <div class="${
      cn(
        "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
        indicator === "dot" && "items-center",
      )
    }">${indicatorHtml}
          <div class="${
      cn(
        "flex flex-1 justify-between leading-none",
        nestLabel ? "items-end" : "items-center",
      )
    }">
            <div class="grid gap-1.5">
              ${nestLabel ? label : ""}
              <span class="text-muted-foreground">${escapeHtml(name)}</span>
            </div>
            <span class="font-mono font-medium text-foreground tabular-nums">${
      escapeHtml(item.formattedValue)
    }</span>
          </div>
        </div>`;
  });
  content += `</div>`;

  el.innerHTML = content;

  const pos = context.chart.canvas.getBoundingClientRect();
  el.style.opacity = "1";
  el.style.position = "absolute";
  el.style.zIndex = "50";
  el.style.left = `${pos.left + globalThis.scrollX + model.caretX}px`;
  el.style.top = `${pos.top + globalThis.scrollY + model.caretY}px`;
  el.style.pointerEvents = "none";
}

const cartesianChart: ChartType[] = ["bar", "bubble", "line", "scatter"];
const radialChart: ChartType[] = ["polarArea", "radar"];
const indexTooltipChart: ChartType[] = ["bar", "line"];

function defaultOptions(
  type: ChartType,
  tooltip?: () => ChartTooltipOptions | undefined,
): ChartOptions {
  const axisDefaults = () => ({
    border: { display: false },
    grid: {
      display: false,
      color: "color-mix(in oklab, var(--border) 50%, transparent)",
    },
    ticks: { display: false, color: "var(--muted-foreground)" },
  });

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: cartesianChart.includes(type)
      ? { x: axisDefaults(), y: axisDefaults() }
      : radialChart.includes(type)
      ? {
        r: {
          grid: { color: "var(--border)" },
          angleLines: { color: "var(--border)" },
          pointLabels: { color: "var(--muted-foreground)" },
          ticks: {
            color: "var(--muted-foreground)",
            backdropColor: "transparent",
          },
        },
      }
      : {},
    plugins: {
      legend: {
        display: false,
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "rectRounded",
          boxWidth: 8,
          boxHeight: 8,
          color: "var(--foreground)",
          font: { size: 12 },
        },
      },
      tooltip: {
        enabled: false,
        external: (context) => showTooltip(context, tooltip?.()),
      },
    },
  };

  if (indexTooltipChart.includes(type)) {
    options.interaction = { mode: "index", intersect: false };
  }

  return options;
}

function createTypedChart(
  type: ChartType,
  components: ChartComponent[],
): Component<TypedChartProps> {
  Chart.register(...components);
  return (props) => (
    <BaseChart
      type={type}
      {...props}
      options={merge(defaultOptions(type, () => props.tooltip), [
        props.options ?? {},
      ])}
    />
  );
}

const BarChart = /* #__PURE__ */ createTypedChart("bar", [
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
]);
const BubbleChart = /* #__PURE__ */ createTypedChart("bubble", [
  BubbleController,
  PointElement,
  LinearScale,
]);
const DonutChart = /* #__PURE__ */ createTypedChart("doughnut", [
  DoughnutController,
  ArcElement,
]);
const LineChart = /* #__PURE__ */ createTypedChart("line", [
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
]);
const PieChart = /* #__PURE__ */ createTypedChart("pie", [
  PieController,
  ArcElement,
]);
const PolarAreaChart = /* #__PURE__ */ createTypedChart("polarArea", [
  PolarAreaController,
  ArcElement,
  RadialLinearScale,
]);
const RadarChart = /* #__PURE__ */ createTypedChart("radar", [
  RadarController,
  LineElement,
  PointElement,
  RadialLinearScale,
]);
const ScatterChart = /* #__PURE__ */ createTypedChart("scatter", [
  ScatterController,
  PointElement,
  LinearScale,
]);

export {
  BarChart,
  BaseChart as Chart,
  BubbleChart,
  ChartContainer,
  ChartStyle,
  DonutChart,
  LineChart,
  PieChart,
  PolarAreaChart,
  RadarChart,
  ScatterChart,
};
