import type { ChartConfig } from "~/registry/ui/charts.tsx";
import { BarChart, ChartContainer } from "~/registry/ui/charts.tsx";

const chartData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "Desktop",
      data: [186, 305, 237, 73, 209, 214],
      backgroundColor: "var(--color-desktop)",
      borderRadius: 4,
    },
    {
      label: "Mobile",
      data: [80, 200, 120, 190, 130, 140],
      backgroundColor: "var(--color-mobile)",
      borderRadius: 4,
    },
  ],
};

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export default function ChartsExampleGrid() {
  return (
    <ChartContainer config={chartConfig} class="min-h-[200px] w-full">
      <BarChart
        data={chartData}
        options={{ scales: { y: { grid: { display: true } } } }}
      />
    </ChartContainer>
  );
}
