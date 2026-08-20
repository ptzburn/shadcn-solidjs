import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/registry/ui/card.tsx";

import type { ChartConfig } from "~/registry/ui/chart.tsx";
import { BarChart, ChartContainer } from "~/registry/ui/chart.tsx";
import { createMemo, createSignal, For } from "solid-js";

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
];

const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function ChartDemo() {
  const [activeChart, setActiveChart] = createSignal<"desktop" | "mobile">(
    "desktop",
  );

  const total = {
    desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
    mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
  };

  const data = createMemo(() => ({
    labels: chartData.map((entry) => entry.date),
    datasets: [
      {
        label: chartConfig.views.label,
        data: chartData.map((entry) => entry[activeChart()]),
        backgroundColor: `var(--color-${activeChart()})`,
      },
    ],
  }));

  return (
    <Card class="py-0 pb-4">
      <CardHeader class="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div class="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <div class="flex">
          <For each={["desktop", "mobile"] as const}>
            {(chart) => (
              <button
                type="button"
                data-active={activeChart() === chart ? "true" : undefined}
                class="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6 data-[active=true]:bg-muted/50"
                onClick={() => setActiveChart(chart)}
              >
                <span class="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span class="font-bold text-lg leading-none sm:text-3xl">
                  {total[chart].toLocaleString()}
                </span>
              </button>
            )}
          </For>
        </div>
      </CardHeader>
      <CardContent class="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          class="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={data()}
            options={{
              scales: {
                x: {
                  ticks: {
                    display: true,
                    maxRotation: 0,
                    autoSkipPadding: 32,
                    callback: function (value) {
                      return new Date(
                        this.getLabelForValue(Number(value)),
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    },
                  },
                },
                y: { grid: { display: true } },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    title: (items) =>
                      new Date(items[0].label).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }),
                  },
                },
              },
            }}
          />
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
