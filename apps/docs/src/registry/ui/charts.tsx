import { cn } from "~/lib/utils.ts";
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

import type { Ref } from "@solid-primitives/refs";
import { mergeRefs } from "@solid-primitives/refs";
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

type TypedChartProps =
  & Omit<ComponentProps<"canvas">, "children" | "height" | "ref" | "width">
  & {
    data: ChartData;
    options?: ChartOptions;
    plugins?: ChartPlugin[];
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
  const [local, others] = splitProps(props, [
    "type",
    "data",
    "options",
    "plugins",
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
    mergeRefs(local.ref, null);
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

const TOOLTIP_CLASS = "cn-chart-tooltip grid min-w-32 items-start";
const TOOLTIP_LABEL_CLASS = "font-medium";
const TOOLTIP_ITEM_LIST_CLASS = "grid gap-1.5";
const TOOLTIP_ITEM_CLASS =
  "flex w-full flex-wrap items-center gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground";
const TOOLTIP_INDICATOR_CLASS =
  "h-2.5 w-2.5 shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)";
const TOOLTIP_ITEM_CONTENT_CLASS =
  "flex flex-1 items-center justify-between leading-none";
const TOOLTIP_ITEM_NAME_CLASS = "text-muted-foreground";
const TOOLTIP_ITEM_VALUE_CLASS =
  "font-mono font-medium text-foreground tabular-nums";

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function showTooltip(context: ChartContext) {
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

  el.className = TOOLTIP_CLASS;

  let content = "";

  model.title.forEach((title) => {
    content += `<div class="${TOOLTIP_LABEL_CLASS}">${escapeHtml(title)}</div>`;
  });

  content += `<div class="${TOOLTIP_ITEM_LIST_CLASS}">`;
  model.dataPoints.forEach((item, index) => {
    const colors = model.labelColors[index];
    const name = item.dataset.label ?? item.label;
    content += `
        <div class="${TOOLTIP_ITEM_CLASS}">
          <div class="${TOOLTIP_INDICATOR_CLASS}" style="--color-bg: ${colors.backgroundColor}; --color-border: ${colors.borderColor}"></div>
          <div class="${TOOLTIP_ITEM_CONTENT_CLASS}">
            <div class="${TOOLTIP_ITEM_LIST_CLASS}">
              <span class="${TOOLTIP_ITEM_NAME_CLASS}">${
      escapeHtml(name)
    }</span>
            </div>
            <span class="${TOOLTIP_ITEM_VALUE_CLASS}">${
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

const cartesianCharts: ChartType[] = ["bar", "bubble", "line", "scatter"];
const radialCharts: ChartType[] = ["polarArea", "radar"];
const indexTooltipCharts: ChartType[] = ["bar", "line"];

function defaultOptions(type: ChartType): ChartOptions {
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
    scales: cartesianCharts.includes(type)
      ? { x: axisDefaults(), y: axisDefaults() }
      : radialCharts.includes(type)
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
        external: (context) => showTooltip(context),
      },
    },
  };

  if (indexTooltipCharts.includes(type)) {
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
      options={merge(defaultOptions(type), [props.options ?? {}])}
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
